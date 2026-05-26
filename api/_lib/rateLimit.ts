/**
 * Per-IP rate limiter for the Anthropic-billed /api/draft-message route.
 *
 * Strategy:
 * - If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, use Upstash
 *   Redis REST (works across serverless instances, survives cold starts).
 * - Otherwise, fall back to an in-memory counter scoped to the current
 *   process. This is leaky across instances/cold starts but still rejects
 *   the obvious case of one client hammering a single warm function.
 *
 * The fallback exists so this module never silently disables itself if the
 * Redis env vars are missing, a partial speed bump is better than none.
 */

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

const memoryStore = new Map<string, { count: number; resetAt: number }>();

async function checkUpstash(
  key: string,
  limit: number,
  windowSec: number,
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const pipelineRes = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, String(windowSec), 'NX'],
      ['PTTL', key],
    ]),
  });
  if (!pipelineRes.ok) {
    throw new Error(`Upstash pipeline failed: ${pipelineRes.status}`);
  }
  const results = (await pipelineRes.json()) as Array<{ result: number }>;
  const count = results[0]?.result ?? 0;
  const pttl = results[2]?.result ?? windowSec * 1000;
  const resetAt = Date.now() + (pttl > 0 ? pttl : windowSec * 1000);
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    limit,
    resetAt,
  };
}

function checkMemory(
  key: string,
  limit: number,
  windowSec: number,
): RateLimitResult {
  const now = Date.now();
  const existing = memoryStore.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowSec * 1000;
    memoryStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, limit, resetAt };
  }
  existing.count += 1;
  return {
    allowed: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    limit,
    resetAt: existing.resetAt,
  };
}

export async function checkRateLimit(
  identifier: string,
  scope: string,
  limit: number,
  windowSec: number,
): Promise<RateLimitResult> {
  const key = `rl:${scope}:${identifier}`;
  try {
    const upstash = await checkUpstash(key, limit, windowSec);
    if (upstash) return upstash;
  } catch (err) {
    console.warn('Upstash rate limit check failed, falling back to memory:', err);
  }
  return checkMemory(key, limit, windowSec);
}

/**
 * Pull the client IP from Vercel-set headers. Falls back to 'unknown' so
 * a malformed request still gets bucketed (and rate-limited) together
 * rather than slipping past the limiter entirely.
 */
export function clientIpFromHeaders(headers: {
  get?: (name: string) => string | null;
  [k: string]: unknown;
}): string {
  const get = (name: string): string | undefined => {
    if (typeof headers.get === 'function') {
      return headers.get(name) ?? undefined;
    }
    const raw = (headers as Record<string, unknown>)[name.toLowerCase()];
    if (Array.isArray(raw)) return raw[0];
    if (typeof raw === 'string') return raw;
    return undefined;
  };
  const forwarded = get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  const real = get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
