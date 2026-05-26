/**
 * Demo-token authentication for the public Vercel deployment.
 *
 * The live demo at telos-kalos.vercel.app is intentionally world-readable,
 * but its write/model routes (POST /api/drafts*, POST /api/draft-message)
 * are gated behind an X-Demo-Token header so bots and scrapers can't
 * mutate the shared draft queue or burn through Anthropic quota.
 *
 * The expected token is in process.env.DEMO_TOKEN; the public value is
 * documented in the README live-demo callout so genuine demo visitors
 * can use it from a browser. This is deliberately weak auth, it's a
 * speed bump, not a security boundary, and the threat model is automated
 * traffic, not a determined human attacker.
 *
 * Fail-closed: if DEMO_TOKEN is not configured on the server, every
 * guarded request returns 503. Local development requires DEMO_TOKEN in
 * .env.local (and VITE_DEMO_TOKEN for the client to send the header).
 */

import type { MiddlewareHandler } from 'hono';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const DEMO_TOKEN_HEADER = 'x-demo-token';

interface AuthResult {
  ok: boolean;
  status: number;
  error?: string;
}

function evaluateToken(provided: string | null | undefined): AuthResult {
  const expected = process.env.DEMO_TOKEN;
  if (!expected) {
    return {
      ok: false,
      status: 503,
      error:
        'DEMO_TOKEN not configured on server. Set it in the deployment environment.',
    };
  }
  if (!provided || provided !== expected) {
    return {
      ok: false,
      status: 401,
      error:
        'Invalid or missing X-Demo-Token header. See the live-demo callout in the README for the public demo value.',
    };
  }
  return { ok: true, status: 200 };
}

/** Hono middleware: gate a route group on a valid X-Demo-Token. */
export const requireDemoToken: MiddlewareHandler = async (c, next) => {
  const result = evaluateToken(c.req.header(DEMO_TOKEN_HEADER));
  if (!result.ok) {
    return c.json({ error: result.error }, result.status as 401 | 503);
  }
  await next();
};

/**
 * Helper for Vercel Node handlers (e.g. api/draft-message.ts) which use
 * the raw req/res API instead of Hono. Returns true if the request was
 * rejected (response already sent); the caller should return immediately.
 */
export function rejectIfUnauthorized(
  req: VercelRequest,
  res: VercelResponse,
): boolean {
  const header = req.headers[DEMO_TOKEN_HEADER];
  const provided = Array.isArray(header) ? header[0] : header;
  const result = evaluateToken(provided);
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return true;
  }
  return false;
}
