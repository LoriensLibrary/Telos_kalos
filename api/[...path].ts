/**
 * /api/* — Hono catch-all REST API for Telos.
 *
 * Routes implemented (all under /api):
 *   GET    /members                       → roster (9 rows from Neon)
 *   GET    /members/:id                   → one member
 *   GET    /members/:id/scans             → DEXA history for that member
 *   GET    /drafts                        → AI Inbox queue (?state=pending|approved|edited|declined)
 *   POST   /drafts                        → insert new draft (used internally by /api/draft-message)
 *   POST   /drafts/:id/approve            → state→approved, decisionAt=now()
 *   POST   /drafts/:id/edit               → state→edited, editedBody=body, decisionAt=now()
 *   POST   /drafts/:id/decline            → state→declined, decisionAt=now()
 *
 * The live-draft endpoint (api/draft-message.ts) takes precedence for
 * /api/draft-message because Vercel routes specific files before catch-all.
 *
 * Runtime: Node (consistent with draft-message.ts and the Vercel adapter
 * pattern for Hono). Database: Neon Postgres via @neondatabase/serverless
 * HTTP driver (no connection pool to manage in serverless).
 */

import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { eq } from 'drizzle-orm';
import { db, DatabaseConfigError } from '../db/client';
import { dexaScans, members, messageDrafts } from '../db/schema';

/** Vercel Edge runtime — required for hono/vercel's `handle()` and works
 *  with @neondatabase/serverless's HTTP-based driver. */
export const config = { runtime: 'edge' };

const app = new Hono().basePath('/api');

// Global error handler — catches DatabaseConfigError + any other thrown
// errors and returns a structured JSON 5xx response instead of letting
// Vercel surface a FUNCTION_INVOCATION_FAILED page.
app.onError((err, c) => {
  if (err instanceof DatabaseConfigError) {
    return c.json(
      {
        error: 'Database not configured',
        detail: err.message,
        hint: 'Add DATABASE_URL to Vercel project Environment Variables, then redeploy.',
      },
      503,
    );
  }
  return c.json(
    { error: err.message ?? 'Internal server error' },
    500,
  );
});

// ─── members ────────────────────────────────────────────────────────────────

app.get('/members', async (c) => {
  const rows = await db.select().from(members);
  return c.json(rows);
});

app.get('/members/:id', async (c) => {
  const id = c.req.param('id');
  const rows = await db.select().from(members).where(eq(members.id, id));
  if (rows.length === 0) {
    return c.json({ error: 'Member not found' }, 404);
  }
  return c.json(rows[0]);
});

app.get('/members/:id/scans', async (c) => {
  const id = c.req.param('id');
  const rows = await db
    .select()
    .from(dexaScans)
    .where(eq(dexaScans.memberId, id));
  // Return ordered by scan number for chart rendering
  rows.sort((a, b) => a.scanNumber - b.scanNumber);
  return c.json(rows);
});

// ─── drafts ─────────────────────────────────────────────────────────────────

app.get('/drafts', async (c) => {
  const stateFilter = c.req.query('state');
  const rows = await db.select().from(messageDrafts);
  // Newest live drafts first, then static seeds
  rows.sort((a, b) => {
    if (a.isLive !== b.isLive) return b.isLive - a.isLive;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  const filtered = stateFilter
    ? rows.filter((r) => r.state === stateFilter)
    : rows;
  return c.json(filtered);
});

app.post('/drafts', async (c) => {
  const body = await c.req.json();
  if (!body?.id || !body?.memberName || !body?.body) {
    return c.json(
      { error: 'id, memberName, and body are required' },
      400,
    );
  }
  await db.insert(messageDrafts).values({
    id: body.id,
    memberId: body.memberId ?? null,
    memberName: body.memberName,
    init: body.init ?? body.memberName.charAt(0).toUpperCase(),
    draftedAt: body.draftedAt ?? new Date().toISOString().slice(11, 16),
    trigger: body.trigger ?? '',
    body: body.body,
    conf: body.conf ?? 'med',
    source: body.source ?? 'unknown',
    state: 'pending',
    isLive: body.isLive ? 1 : 0,
    model: body.model ?? null,
    inputTokens: body.inputTokens ?? null,
    outputTokens: body.outputTokens ?? null,
  });
  return c.json({ ok: true, id: body.id }, 201);
});

app.post('/drafts/:id/approve', async (c) => {
  const id = c.req.param('id');
  const result = await db
    .update(messageDrafts)
    .set({
      state: 'approved',
      decisionAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(messageDrafts.id, id))
    .returning();
  if (result.length === 0) {
    return c.json({ error: 'Draft not found' }, 404);
  }
  return c.json(result[0]);
});

app.post('/drafts/:id/edit', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  if (typeof body?.body !== 'string') {
    return c.json({ error: 'body (edited text) is required' }, 400);
  }
  const result = await db
    .update(messageDrafts)
    .set({
      state: 'edited',
      editedBody: body.body,
      decisionAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(messageDrafts.id, id))
    .returning();
  if (result.length === 0) {
    return c.json({ error: 'Draft not found' }, 404);
  }
  return c.json(result[0]);
});

app.post('/drafts/:id/decline', async (c) => {
  const id = c.req.param('id');
  const result = await db
    .update(messageDrafts)
    .set({
      state: 'declined',
      decisionAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(messageDrafts.id, id))
    .returning();
  if (result.length === 0) {
    return c.json({ error: 'Draft not found' }, 404);
  }
  return c.json(result[0]);
});

// ─── health ─────────────────────────────────────────────────────────────────

app.get('/health', async (c) => {
  try {
    const rows = await db.select().from(members);
    return c.json({
      ok: true,
      members: rows.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return c.json(
      { ok: false, error: err instanceof Error ? err.message : 'unknown' },
      503,
    );
  }
});

export default handle(app);
