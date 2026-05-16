import { useEffect, useState } from 'react';
import { DRAFTS, type DraftMsg } from '../../data/chat';
import { generateDraft } from '../../api/draftClient';
import {
  liveListDrafts,
  liveApproveDraft,
  liveEditDraft,
  liveDeclineDraft,
  type BackendDraft,
} from '../../api/telosApi';
import { LIVE_SCENARIOS, type DraftState, staticToBackend } from './shared';

export default function InboxView() {
  // Drafts come from /api/drafts (Phase 2: Postgres-backed via Hono +
  // Drizzle). Initial value `null` = "still loading"; empty array = "loaded,
  // no drafts"; populated = ready. Fallback path on fetch failure uses the
  // static seeds so the demo doesn't break in pure-vite dev mode.
  const [drafts, setDrafts] = useState<BackendDraft[] | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  /** Tracks which LIVE_SCENARIOS index produced each live draft, so the per-card
   *  Regenerate button can re-call Claude with the *same* scenario. */
  const [scenarioByDraft, setScenarioByDraft] = useState<Record<string, number>>({});
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load from backend. Abort on unmount so we don't setState on a
  // stale component (Performance is unmounted on route change before the
  // fetch's ~80ms latency resolves).
  useEffect(() => {
    const controller = new AbortController();
    liveListDrafts(undefined, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setDrafts(data);
        setUsingFallback(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        // AbortError shouldn't trigger the fallback path either.
        if (err instanceof DOMException && err.name === 'AbortError') return;
        // Backend unreachable (e.g., vite dev). Fall back to static seeds so
        // the UI still works for local development and code review.
        setDrafts(DRAFTS.map(staticToBackend));
        setUsingFallback(true);
      });
    return () => controller.abort();
  }, []);

  const liveDraftCount = drafts ? drafts.filter((d) => d.isLive === 1).length : 0;
  const pending = drafts ? drafts.filter((d) => d.state === 'pending').length : 0;

  const runGenerate = async (scenarioIndex: number) => {
    setGenerating(true);
    setError(null);
    const scenario = LIVE_SCENARIOS[scenarioIndex];
    const result = await generateDraft({
      memberName: scenario.member,
      memberInit: scenario.init,
      trigger: scenario.trigger,
      metrics: scenario.metrics,
    });
    if (result.state === 'success') {
      // Optimistically add the live draft to local state. The server may or
      // may not have persisted it to Postgres — if DATABASE_URL isn't set on
      // this deployment, the server's DB write silently fails (non-fatal by
      // design) and the row won't appear in a refetch. Adding locally first
      // means the analyst sees the draft regardless of DB state.
      const nowIso = new Date().toISOString();
      const optimistic: BackendDraft = {
        id: result.draft.id,
        memberId: null,
        memberName: result.draft.member,
        init: result.draft.init,
        draftedAt: result.draft.draftedAt,
        trigger: result.draft.trigger,
        body: result.draft.body,
        conf: result.draft.conf,
        source: result.draft.source,
        state: 'pending',
        isLive: 1,
        model: result.draft.meta?.model ?? null,
        inputTokens: result.draft.meta?.inputTokens ?? null,
        outputTokens: result.draft.meta?.outputTokens ?? null,
        editedBody: null,
        decisionAt: null,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setDrafts((prev) => (prev ? [optimistic, ...prev] : [optimistic]));
      setScenarioByDraft((prev) => ({ ...prev, [result.draft.id]: scenarioIndex }));
      // Try to pull canonical server state. If refetch succeeds AND contains
      // the new draft (DB write worked), prefer server shape. If refetch
      // succeeds but doesn't contain it (DB write failed silently), keep our
      // optimistic row prepended. If refetch fails entirely (e.g. /api/drafts
      // 503s because DATABASE_URL is unset), leave optimistic state in place.
      try {
        const data = await liveListDrafts();
        setDrafts(() => {
          const serverHasIt = data.some((d) => d.id === optimistic.id);
          return serverHasIt ? data : [optimistic, ...data];
        });
        setUsingFallback(false);
      } catch {
        // Silent — optimistic state remains.
      }
    } else {
      const friendly =
        result.error.kind === 'config'
          ? 'Live drafting is not configured on this deployment yet (server-side API key missing).'
          : result.error.kind === 'network'
          ? 'Could not reach the drafting service. (Live drafts run only on the deployed Vercel build, not in local dev.)'
          : result.error.message;
      setError(friendly);
    }
    setGenerating(false);
  };

  const handleGenerate = () => runGenerate(liveDraftCount % LIVE_SCENARIOS.length);

  const handleRegenerate = (draftId: string) => {
    const idx = scenarioByDraft[draftId] ?? 0;
    // Optimistically drop locally, then re-run. The server still has the old
    // row but the analyst won't see it after refetch (decline via the same
    // endpoint flow would be more correct for a real product; this is a demo
    // affordance).
    setDrafts((prev) => prev?.filter((d) => d.id !== draftId) ?? null);
    setScenarioByDraft((prev) => {
      const next = { ...prev };
      delete next[draftId];
      return next;
    });
    void runGenerate(idx);
  };

  const handleApprove = async (id: string, isEdit: boolean) => {
    if (usingFallback) {
      // Dev/no-backend mode: mutate local state directly
      setDrafts((prev) =>
        prev?.map((d) =>
          d.id === id
            ? { ...d, state: isEdit ? 'edited' : 'approved', editedBody: isEdit ? edits[id] ?? null : d.editedBody }
            : d,
        ) ?? null,
      );
      setEditing(null);
      return;
    }
    try {
      const updated = isEdit
        ? await liveEditDraft(id, edits[id] ?? '')
        : await liveApproveDraft(id);
      setDrafts((prev) => prev?.map((d) => (d.id === id ? updated : d)) ?? null);
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    }
  };

  const handleDecline = async (id: string) => {
    if (usingFallback) {
      setDrafts((prev) =>
        prev?.map((d) => (d.id === id ? { ...d, state: 'declined' } : d)) ?? null,
      );
      return;
    }
    try {
      const updated = await liveDeclineDraft(id);
      setDrafts((prev) => prev?.map((d) => (d.id === id ? updated : d)) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decline');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="lbl mb-3" style={{ color: 'var(--cy)' }}>AI INBOX · DRAFTED MESSAGES</div>
          <h2 style={{ fontSize: 'clamp(1.6rem,2.5vw,2rem)', fontWeight: 300, lineHeight: 1.05 }}>
            Drafted for review. You decide what sends.
          </h2>
          <p className="mt-2 text-sm max-w-xl" style={{ color: 'var(--ink-s)' }}>
            Pattern-matched against 2,840+ coaching arcs (synthetic in this demo). Nothing sends without your approval.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-ac"
            data-testid="generate-live-draft"
            style={{ opacity: generating ? 0.6 : 1, cursor: generating ? 'wait' : 'pointer' }}
          >
            {generating ? 'Generating…' : '✨ Generate Live Draft'}
          </button>
          <span className="chip chip-cy"><span className="dot dot-cy pulse" /> {pending} PENDING</span>
        </div>
      </div>

      {usingFallback && (
        <div
          className="mb-5 p-4 rounded-xl text-sm"
          role="status"
          style={{
            background: 'color-mix(in srgb, var(--cy) 6%, transparent)',
            border: '1px solid color-mix(in srgb, var(--cy) 24%, transparent)',
            color: 'rgba(245,247,250,0.78)',
          }}
        >
          <span className="lbl mr-2" style={{ color: 'var(--cy)' }}>DEV MODE</span>
          Backend unreachable — showing static seed drafts. State changes won't persist. Live deployment uses Postgres (Neon) via the Hono REST API.
        </div>
      )}

      {error && (
        <div
          className="mb-5 p-4 rounded-xl text-sm"
          role="alert"
          style={{
            background: 'color-mix(in srgb, var(--warn) 6%, transparent)',
            border: '1px solid color-mix(in srgb, var(--warn) 24%, transparent)',
            color: '#FFD9A0',
          }}
        >
          <span className="lbl mr-2" style={{ color: 'var(--warn)' }}>HEADS UP</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-3 gap-5">
        {generating && <SkeletonDraftCard />}
        {drafts === null ? (
          // Initial load
          <>
            <SkeletonDraftCard />
            <SkeletonDraftCard />
            <SkeletonDraftCard />
          </>
        ) : (
          drafts.map((d) => {
            const isLive = d.isLive === 1;
            const draftMsg: DraftMsg = {
              id: d.id,
              member: d.memberName,
              init: d.init,
              draftedAt: d.draftedAt,
              trigger: d.trigger,
              body: d.editedBody ?? d.body,
              conf: d.conf,
              source: d.source,
            };
            const meta = isLive && d.model && d.inputTokens !== null && d.outputTokens !== null
              ? { model: d.model, inputTokens: d.inputTokens, outputTokens: d.outputTokens }
              : undefined;
            return (
              <DraftCard
                key={d.id}
                d={draftMsg}
                isLive={isLive}
                liveMeta={meta}
                state={d.state}
                editing={editing === d.id}
                body={edits[d.id] ?? draftMsg.body}
                onApprove={() => handleApprove(d.id, editing === d.id)}
                onEdit={() => setEditing(editing === d.id ? null : d.id)}
                onDecline={() => handleDecline(d.id)}
                onBodyChange={(v) => setEdits((p) => ({ ...p, [d.id]: v }))}
                onRegenerate={isLive && d.state === 'pending' ? () => handleRegenerate(d.id) : undefined}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

/**
 * Pulsing placeholder shown in-grid while a live draft is being generated.
 * Same visual footprint as a real DraftCard so the layout doesn't jump on swap-in.
 */
function SkeletonDraftCard() {
  return (
    <div
      className="glass-deep p-6 animate-pulse"
      data-testid="draft-skeleton"
      style={{
        outline: '1px dashed color-mix(in srgb, var(--ac) 30%, transparent)',
      }}
    >
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl"
            style={{ background: 'color-mix(in srgb, var(--ac) 14%, transparent)' }}
          />
          <div>
            <div className="h-3 w-24 mb-2 rounded" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <div className="h-2 w-16 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </div>
        <span className="chip chip-ac">
          <span className="dot dot-ac pulse" /> GENERATING…
        </span>
      </div>
      <div
        className="h-8 mb-4 rounded-lg"
        style={{ background: 'color-mix(in srgb, var(--cy) 6%, transparent)' }}
      />
      <div className="bub bub-ai mb-4" style={{ maxWidth: '100%' }}>
        <div className="space-y-2">
          <div className="h-3 w-full rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-3 w-5/6 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-3 w-4/6 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>
      </div>
    </div>
  );
}

function DraftCard({ d, state, editing, body, isLive, liveMeta, onApprove, onEdit, onDecline, onBodyChange, onRegenerate }: {
  d: DraftMsg; state: DraftState; editing: boolean; body: string; isLive?: boolean;
  liveMeta?: { model: string; inputTokens: number; outputTokens: number };
  onApprove: () => void; onEdit: () => void; onDecline: () => void; onBodyChange: (v: string) => void;
  onRegenerate?: () => void;
}) {
  return (
    <div
      className="glass-deep p-6"
      style={
        isLive
          ? {
              outline: '1px solid color-mix(in srgb, var(--ac) 40%, transparent)',
              boxShadow: '0 0 32px color-mix(in srgb, var(--ac) 14%, transparent)',
            }
          : undefined
      }
      data-live={isLive ? 'true' : 'false'}
    >
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center serif text-base"
            style={{
              background: 'color-mix(in srgb, var(--ac) 14%, transparent)',
              color: 'var(--ac-b)',
              border: '1px solid color-mix(in srgb, var(--ac) 30%, transparent)',
            }}
          >
            {d.init}
          </div>
          <div>
            <div className="text-sm" style={{ fontWeight: 500 }}>{d.member}</div>
            <div className="lbl mt-1" style={{ fontSize: 9 }}>DRAFTED {d.draftedAt}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isLive && (
            <span className="chip chip-ac" title="Generated live by Claude on demand">
              <span className="dot dot-ac pulse" /> LIVE · CLAUDE
            </span>
          )}
          {state === 'pending' && <span className="chip chip-cy"><span className="dot dot-cy" /> PENDING</span>}
          {state === 'approved' && <span className="chip chip-ac"><span className="dot dot-ac" /> SENT</span>}
          {state === 'edited' && <span className="chip chip-ac"><span className="dot dot-ac" /> SENT · EDITED</span>}
          {state === 'declined' && <span className="chip">DECLINED</span>}
        </div>
      </div>

      <div className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: 'color-mix(in srgb, var(--cy) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--cy) 18%, transparent)', color: 'var(--ink-s)' }}>
        <span className="lbl mr-2" style={{ color: 'var(--cy)' }}>TRIGGER</span>{d.trigger}
      </div>

      <div className="bub bub-ai mb-4" style={{ maxWidth: '100%' }}>
        {editing ? (
          <textarea
            className="input"
            rows={5}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
        ) : body}
        <div className="mono mt-3" style={{ fontSize: 9, letterSpacing: '0.10em', color: 'var(--ink-m)' }}>
          {d.source} · CONFIDENCE: {d.conf.toUpperCase()}
        </div>
      </div>

      {liveMeta && (
        <div
          className="mb-4 inline-flex items-center gap-2 px-2 py-1 rounded-md text-[10px] mono"
          data-testid="live-draft-meta"
          style={{
            background: 'color-mix(in srgb, var(--ac) 6%, transparent)',
            border: '1px solid color-mix(in srgb, var(--ac) 18%, transparent)',
            color: 'rgba(245,247,250,0.55)',
            letterSpacing: '0.05em',
          }}
          title="Model + token usage from this generation — for analyst-side transparency on AI cost"
        >
          {liveMeta.model} · in {liveMeta.inputTokens} · out {liveMeta.outputTokens} tok
        </div>
      )}

      {state === 'pending' && (
        <div className="flex items-center gap-2 flex-wrap">
          <button className="btn-ac" onClick={onApprove}>{editing ? 'Save & Send' : 'Approve & Send'}</button>
          <button className="btn-gh" onClick={onEdit}>{editing ? 'Cancel Edit' : 'Edit'}</button>
          {onRegenerate && (
            <button
              className="btn-gh"
              onClick={onRegenerate}
              data-testid="regenerate-draft"
              title="Re-run Claude with the same context — useful if the first draft missed the tone"
            >
              ↻ Regenerate
            </button>
          )}
          <button className="btn-gh" onClick={onDecline} style={{ color: 'var(--ink-s)' }}>Decline</button>
        </div>
      )}
    </div>
  );
}
