/**
 * Drizzle + Neon serverless DB client.
 *
 * Uses @neondatabase/serverless's HTTP-based driver, which is the
 * recommended driver for Vercel serverless functions (no connection
 * pool to manage, designed for short-lived invocations).
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Lazy DB initialization. Avoids throwing at module-load time, which
 * on Vercel surfaces as a confusing FUNCTION_INVOCATION_FAILED instead
 * of a clean 500 with a helpful message. The route handler can catch
 * the missing-env error and return a structured response.
 */

let cachedDb: ReturnType<typeof drizzle> | null = null;

export class DatabaseConfigError extends Error {
  constructor() {
    super(
      'DATABASE_URL not set. Locally: copy from .env. In production: configure in Vercel project env vars.',
    );
    this.name = 'DatabaseConfigError';
  }
}

export function getDb() {
  if (cachedDb) return cachedDb;
  const url = process.env.DATABASE_URL;
  if (!url) throw new DatabaseConfigError();
  const sql = neon(url);
  cachedDb = drizzle(sql, { schema });
  return cachedDb;
}

/**
 * Convenience proxy so existing callers can keep writing `db.select(...)`.
 * The first property access triggers `getDb()`, which throws cleanly if
 * DATABASE_URL is missing — caught by route handlers, returned as JSON.
 */
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const realDb = getDb();
    const value = (realDb as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function' ? value.bind(realDb) : value;
  },
});

export { schema };
