import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db/client';
import { messageDrafts } from '../db/schema';

/**
 * /api/draft-message — live AI draft generation for the Performance AI Inbox.
 *
 * Takes a member context (name, trigger, optional recent chat / metrics) and
 * returns a structured draft message in the same shape as the static demo
 * drafts in src/data/chat.ts (DraftMsg).
 *
 * The draft is *never sent* without analyst approval — the response is wired
 * into the existing approve/edit/decline state machine on the client.
 *
 * Model: claude-haiku-4-5 (fast, cheap, sufficient for structured short-form).
 * Auth: requires ANTHROPIC_API_KEY in the environment (Vercel env var in prod,
 * .env.local in dev).
 */

interface DraftRequest {
  memberName: string;
  memberInit?: string;
  trigger: string;
  recentMessages?: string[];
  metrics?: Record<string, string | number>;
}

interface DraftResponse {
  id: string;
  member: string;
  init: string;
  draftedAt: string;
  trigger: string;
  body: string;
  conf: 'high' | 'med' | 'low';
  source: string;
  /** Flag so the UI can render this differently from the static demo drafts. */
  live: true;
  /** Model + token info for transparency. */
  meta: { model: string; inputTokens: number; outputTokens: number };
}

const SYSTEM_PROMPT = `You are Telos — an AI assistant for Kalos Health. You draft messages from a Performance Analyst (the human expert at Kalos) to a member. The analyst always reviews and approves your drafts before anything sends; you are leverage, not replacement.

Kalos's coaching philosophy:
- Supportive accountability. Never strict correction.
- Pattern, not raw disclosure. Never expose private member text the analyst hasn't already surfaced.
- Specific to the member's actual data (DEXA scans, adherence, recovery signals).
- Short, direct, warm. Like a senior Performance Analyst, not a chatbot.
- "Between-scan continuity" — your job is to hold momentum across the gaps.

Terminology: refer to the human at Kalos as the *Performance Analyst* or *analyst* — never "coach." The activity itself can be called "coaching" (matches Kalos's own language), but the role is Performance Analyst.

You will receive a member context: name, trigger reason, optionally recent member messages and metrics. Draft a single message from the analyst to the member, then return ONLY a JSON object with these exact fields (no markdown, no commentary, no code fences):

{
  "body": string — the draft message body (60-300 chars, direct, warm, specific),
  "conf": "high" | "med" | "low" — your confidence in the recommendation given the data,
  "reasoning": string — one short sentence on why this draft (used as the source citation)
}

Hard rules:
- Never make medical claims or give diagnostic advice.
- Never reference private disclosures unless explicitly given in recentMessages.
- Never promise outcomes. Frame as pattern-matched suggestions.
- If the trigger involves stress/family/personal disclosure, soften tone further and de-emphasize numbers.`;

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function initials(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY not configured on server',
    });
  }

  let body: DraftRequest;
  try {
    body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as DraftRequest;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (!body?.memberName || !body?.trigger) {
    return res.status(400).json({
      error: 'memberName and trigger are required',
    });
  }

  const userPrompt = [
    `Member: ${body.memberName}`,
    `Trigger: ${body.trigger}`,
    body.metrics
      ? `Metrics:\n${Object.entries(body.metrics)
          .map(([k, v]) => `  - ${k}: ${v}`)
          .join('\n')}`
      : '',
    body.recentMessages?.length
      ? `Recent member messages (explicitly surfaced, OK to reference):\n${body.recentMessages.map((m) => `  - "${m}"`).join('\n')}`
      : '',
    '',
    'Draft the message. JSON only.',
  ]
    .filter(Boolean)
    .join('\n');

  const client = new Anthropic({ apiKey });

  try {
    const completion = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 500,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    // Anthropic returns content as an array of blocks; we expect a single text block.
    const textBlock = completion.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return res.status(502).json({ error: 'No text content returned from model' });
    }

    // Strip any accidental code fences before parsing.
    const raw = textBlock.text.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
    let parsed: { body: string; conf: 'high' | 'med' | 'low'; reasoning: string };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(502).json({
        error: 'Model returned non-JSON content',
        raw: raw.slice(0, 200),
      });
    }

    if (!parsed.body || !parsed.conf || !parsed.reasoning) {
      return res.status(502).json({
        error: 'Model output missing required fields',
        got: parsed,
      });
    }

    const response: DraftResponse = {
      id: `d-live-${Date.now()}`,
      member: body.memberName,
      init: body.memberInit ?? initials(body.memberName),
      draftedAt: nowHHMM(),
      trigger: body.trigger,
      body: parsed.body,
      conf: parsed.conf,
      source: `Live Claude generation · ${parsed.reasoning}`,
      live: true,
      meta: {
        model: completion.model,
        inputTokens: completion.usage.input_tokens,
        outputTokens: completion.usage.output_tokens,
      },
    };

    // Persist the live draft to Postgres so it survives reloads + can be
    // approved/edited/declined through the same /api/drafts/:id/* endpoints
    // that the static seeds use. DB write must not break the response if it
    // fails — the analyst still sees the draft, we just don't persist it.
    try {
      await db.insert(messageDrafts).values({
        id: response.id,
        memberId: null,
        memberName: response.member,
        init: response.init,
        draftedAt: response.draftedAt,
        trigger: response.trigger,
        body: response.body,
        conf: response.conf,
        source: response.source,
        state: 'pending',
        isLive: 1,
        model: response.meta.model,
        inputTokens: response.meta.inputTokens,
        outputTokens: response.meta.outputTokens,
      });
    } catch (dbErr) {
      // Non-fatal — log to function output, ship the draft anyway
      console.error('Failed to persist live draft to Postgres:', dbErr);
    }

    return res.status(200).json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(502).json({ error: `Claude API error: ${message}` });
  }
}
