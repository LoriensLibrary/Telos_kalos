import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateDraft } from './draftClient';

/**
 * Contract test for the live-draft frontend client.
 *
 * The client must:
 * - Never throw — all failure modes return a discriminated `{state: 'error', error: {kind, message}}`.
 * - Map specific error shapes to the right `kind` so the UI can render appropriate messaging.
 * - Pass through the server response shape on success.
 */

const ORIGINAL_FETCH = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  vi.restoreAllMocks();
});

describe('generateDraft', () => {
  describe('success', () => {
    beforeEach(() => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          id: 'd-live-12345',
          member: 'Sam K.',
          init: 'S',
          draftedAt: '11:00',
          trigger: 'test',
          body: 'A friendly check-in message about consistency.',
          conf: 'high',
          source: 'Live Claude generation · supportive tone',
          live: true,
          meta: { model: 'claude-haiku-4-5', inputTokens: 100, outputTokens: 80 },
        }),
      }) as unknown as typeof fetch;
    });

    it('returns a typed live draft on 200 OK', async () => {
      const result = await generateDraft({
        memberName: 'Sam K.',
        trigger: 'test',
      });
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.draft.live).toBe(true);
        expect(result.draft.member).toBe('Sam K.');
        expect(result.draft.body.length).toBeGreaterThan(0);
      }
    });
  });

  describe('error mapping', () => {
    it('maps missing API key to kind:"config"', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'ANTHROPIC_API_KEY not configured on server' }),
      }) as unknown as typeof fetch;

      const result = await generateDraft({ memberName: 'X', trigger: 't' });
      expect(result.state).toBe('error');
      if (result.state === 'error') {
        expect(result.error.kind).toBe('config');
      }
    });

    it('maps fetch throw to kind:"network"', async () => {
      globalThis.fetch = vi
        .fn()
        .mockRejectedValue(new Error('Failed to fetch')) as unknown as typeof fetch;

      const result = await generateDraft({ memberName: 'X', trigger: 't' });
      expect(result.state).toBe('error');
      if (result.state === 'error') {
        expect(result.error.kind).toBe('network');
        expect(result.error.message).toMatch(/Failed to fetch/);
      }
    });

    it('maps 400 to kind:"validation"', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'memberName and trigger are required' }),
      }) as unknown as typeof fetch;

      const result = await generateDraft({ memberName: '', trigger: '' });
      expect(result.state).toBe('error');
      if (result.state === 'error') {
        expect(result.error.kind).toBe('validation');
      }
    });

    it('maps 502 model errors to kind:"model"', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({ error: 'Claude API error: rate limited' }),
      }) as unknown as typeof fetch;

      const result = await generateDraft({ memberName: 'X', trigger: 't' });
      expect(result.state).toBe('error');
      if (result.state === 'error') {
        expect(result.error.kind).toBe('model');
      }
    });

    it('handles non-JSON responses gracefully', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => {
          throw new Error('Unexpected token');
        },
      }) as unknown as typeof fetch;

      const result = await generateDraft({ memberName: 'X', trigger: 't' });
      expect(result.state).toBe('error');
      if (result.state === 'error') {
        expect(result.error.kind).toBe('network');
      }
    });
  });

  describe('request shape', () => {
    it('sends POST with JSON Content-Type and the request body', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          id: 'd-live-1',
          member: 'M',
          init: 'M',
          draftedAt: '00:00',
          trigger: 't',
          body: 'x',
          conf: 'med',
          source: 's',
          live: true,
          meta: { model: 'claude-haiku-4-5', inputTokens: 1, outputTokens: 1 },
        }),
      });
      globalThis.fetch = fetchMock as unknown as typeof fetch;

      await generateDraft({
        memberName: 'Maya',
        trigger: 'test trigger',
        metrics: { adherence: '50%' },
      });

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/draft-message',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Maya'),
        }),
      );
    });
  });
});
