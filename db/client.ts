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

function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL not set. Locally: copy from .env. In production: configure in Vercel project env vars.',
    );
  }
  return url;
}

const sql = neon(getConnectionString());

export const db = drizzle(sql, { schema });
export { schema };
