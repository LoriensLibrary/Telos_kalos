/**
 * Frontend client for the /api/draft-message Vercel serverless function.
 *
 * The server-side handler lives at api/draft-message.ts and calls the Anthropic
 * API with ANTHROPIC_API_KEY from the environment. This module is the React/UI
 * side: it knows how to call it, handle errors, and return drafts in the same
 * shape the existing AI Inbox already consumes (DraftMsg).
 */

import type { DraftMsg } from '../data/chat';

export interface DraftRequest {
  memberName: string;
  memberInit?: string;
  trigger: string;
  recentMessages?: string[];
  metrics?: Record<string, string | number>;
}

export interface LiveDraft extends DraftMsg {
  /** True for drafts generated live via Claude (vs the static demo seed). */
  live: true;
  meta?: { model: string; inputTokens: number; outputTokens: number };
}

export type DraftError =
  | { kind: 'config'; message: string }
  | { kind: 'network'; message: string }
  | { kind: 'validation'; message: string }
  | { kind: 'model'; message: string };

export type DraftResult =
  | { state: 'success'; draft: LiveDraft }
  | { state: 'error'; error: DraftError };

/**
 * Request a live AI-drafted message from the backend.
 *
 * Returns a discriminated union — never throws — so callers can render
 * specific error states (e.g. "API key not configured" vs "network down")
 * without try/catch noise.
 */
export async function generateDraft(req: DraftRequest): Promise<DraftResult> {
  let res: Response;
  try {
    res = await fetch('/api/draft-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
  } catch (err) {
    return {
      state: 'error',
      error: {
        kind: 'network',
        message: err instanceof Error ? err.message : 'Network request failed',
      },
    };
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    return {
      state: 'error',
      error: { kind: 'network', message: `Non-JSON response (HTTP ${res.status})` },
    };
  }

  if (!res.ok) {
    const errBody = payload as { error?: string };
    const message = errBody?.error ?? `HTTP ${res.status}`;
    const kind: DraftError['kind'] = message.includes('ANTHROPIC_API_KEY')
      ? 'config'
      : res.status === 400
      ? 'validation'
      : 'model';
    return { state: 'error', error: { kind, message } };
  }

  return { state: 'success', draft: payload as LiveDraft };
}
