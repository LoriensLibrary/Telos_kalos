import { useEffect, useState } from 'react';
import { CLIENTS, CASELOAD } from '../data/clients';
import { DRAFTS, type DraftMsg } from '../data/chat';
import { TODAY_SCHEDULE, PROTOCOLS, DAY_BRIEF, type Session } from '../data/day';
import DEXAChart from '../components/charts/DEXAChart';
import AdherenceChart from '../components/charts/AdherenceChart';
import TriangleChart from '../components/charts/TriangleChart';
import Tabs from '../components/ui/Tabs';
import Feedback from '../components/ui/Feedback';
import AnalystPerformance from '../components/ui/AnalystPerformance';
import { generateDraft } from '../api/draftClient';
import {
  liveListDrafts,
  liveApproveDraft,
  liveEditDraft,
  liveDeclineDraft,
  type BackendDraft,
} from '../api/telosApi';

/**
 * Pre-set scenarios for live AI draft generation. Each represents a different
 * coaching context (slip, plateau, stress disclosure) — distinct from the
 * static seed drafts so live drafts are clearly *new* alongside them.
 */
interface LiveScenario {
  member: string;
  init: string;
  trigger: string;
  metrics: Record<string, string>;
}

const LIVE_SCENARIOS: LiveScenario[] = [
  {
    member: 'Sam K.',
    init: 'S',
    trigger: 'First 7 days: 2/5 lifts logged, no food entries, two missed check-ins',
    metrics: {
      adherence: '40%',
      hrv: '52ms (baseline)',
      lifts_logged: '2/5',
      food_entries: '0',
    },
  },
  {
    member: 'Jordan T.',
    init: 'J',
    trigger: 'Scan #3: lean mass plateau despite 100% adherence and clean recovery. Member asked about advanced programming.',
    metrics: {
      adherence: '100% · 6 weeks',
      lean_mass: '+0.4 lb (plateau)',
      hrv: '68ms (clean)',
      recovery: '88%',
    },
  },
  {
    member: 'Alex M.',
    init: 'A',
    trigger: 'Member disclosed work stress and family caregiving. HRV dropped 20%. Sleep averaging 5h. Wants to keep training schedule unchanged.',
    metrics: {
      adherence: '78%',
      hrv: '38ms (↓ 20%)',
      sleep: '5h 02m',
      disclosed: 'high cognitive load, caregiving',
    },
  },
];

type DraftState = 'pending' | 'approved' | 'edited' | 'declined';

const TABS = [
  { id: 'day', label: 'Today' },
  { id: 'inbox', label: 'AI Inbox', badge: 3 },
  { id: 'caseload', label: 'Caseload' },
  { id: 'me', label: 'My Performance' },
  { id: 'standards', label: 'Standards' },
  { id: 'feedback', label: 'Suggestions' },
];

export default function Performance() {
  const [tab, setTab] = useState('day');
  const [sel, setSel] = useState<string | null>(null);
  const c = sel ? CLIENTS.find((x) => x.id === sel) : null;

  if (c) return <MemberDetail client={c} onBack={() => setSel(null)} />;

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-14">
      {/* HEAD */}
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>
            PERFORMANCE STUDIO · JAMES WEI · ANALYST · METABOLIC HEALTH
          </div>
          <h1
            className="brk"
            style={{
              fontSize: 'clamp(2.6rem,5vw,3.8rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
              fontWeight: 300,
              padding: '8px 0',
            }}
          >
            {DAY_BRIEF.greet.split(',')[0]},{' '}
            <em className="serif italic holo" style={{ fontWeight: 400 }}>
              {DAY_BRIEF.greet.split(', ')[1]?.replace('.', '')}
            </em>
            .
          </h1>
          <p className="mt-3 text-base max-w-2xl" style={{ color: 'var(--ink-s)' }}>
            {DAY_BRIEF.sessions} sessions today · {DAY_BRIEF.drafted} drafted messages to review ·{' '}
            {DAY_BRIEF.flagged} flagged member. Day plan is ready when you are.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip chip-cy">
            <span className="dot dot-cy pulse" /> {DAY_BRIEF.weather}
          </span>
          <span className="chip chip-pur">{DAY_BRIEF.cohort}</span>
        </div>
      </div>

      <div className="mb-8">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'day' && <DayView />}
      {tab === 'inbox' && <InboxView />}
      {tab === 'caseload' && <CaseloadView onOpen={setSel} />}
      {tab === 'me' && <AnalystPerformance />}
      {tab === 'standards' && <StandardsView />}
      {tab === 'feedback' && <Feedback audience="analyst" />}
    </div>
  );
}

/* ============================ DAY VIEW ============================ */

function DayView() {
  const [openId, setOpenId] = useState<string | null>('s1');
  const open = TODAY_SCHEDULE.find((s) => s.id === openId);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT — SCHEDULE TIMELINE */}
      <div className="col-span-5">
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="lbl" style={{ color: 'var(--ac-b)' }}>SCHEDULE · WEDNESDAY MAY 13</div>
            <span className="chip chip-ac">AI-PREPARED</span>
          </div>
          <div className="space-y-2">
            {TODAY_SCHEDULE.map((s) => (
              <ScheduleBlock key={s.id} s={s} active={openId === s.id} onClick={() => setOpenId(s.id)} />
            ))}
          </div>
          <div className="hairline-dash mt-5 pt-4">
            <div className="lbl mb-2">DAY STATS</div>
            <div className="grid grid-cols-3 gap-3">
              <div><div className="lbl" style={{ fontSize: 9 }}>SESSIONS</div><div className="mono num text-lg">6</div></div>
              <div><div className="lbl" style={{ fontSize: 9 }}>SCANS REV.</div><div className="mono num text-lg">2</div></div>
              <div><div className="lbl" style={{ fontSize: 9 }}>NEW INTAKE</div><div className="mono num text-lg">1</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — SESSION DETAIL */}
      <div className="col-span-7">
        {open ? <SessionDetail s={open} /> : <EmptyDetail />}
      </div>
    </div>
  );
}

function ScheduleBlock({ s, active, onClick }: { s: Session; active: boolean; onClick: () => void }) {
  const isBlock = s.status === 'block';
  const isDone = s.status === 'done';
  const isNow = s.status === 'now';
  const c = isNow ? 'var(--ac)' : isDone ? 'var(--ink-m)' : isBlock ? 'var(--ink-m)' : 'var(--cy)';

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-stretch gap-3 p-3 rounded-xl transition-all"
      style={{
        background: active ? 'color-mix(in srgb, var(--ac) 8%, transparent)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${active ? 'color-mix(in srgb, var(--ac) 32%, transparent)' : 'var(--line)'}`,
        boxShadow: active ? 'inset 0 0 0 1px color-mix(in srgb, var(--ac) 20%, transparent)' : 'none',
        opacity: isDone ? 0.55 : 1,
        cursor: 'pointer',
      }}
    >
      <div className="text-center" style={{ width: 56, flexShrink: 0 }}>
        <div className="mono num text-sm">{s.time}</div>
        <div className="lbl" style={{ fontSize: 8, marginTop: 2 }}>{s.duration}</div>
      </div>
      <div style={{ width: 1, background: c, opacity: 0.4, alignSelf: 'stretch' }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {!isBlock && (
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center serif text-sm flex-shrink-0"
              style={{
                background: 'color-mix(in srgb, var(--ac) 12%, transparent)',
                color: 'var(--ac-b)',
                border: '1px solid color-mix(in srgb, var(--ac) 28%, transparent)',
              }}
            >
              {s.init}
            </div>
          )}
          <div className="text-sm truncate" style={{ fontWeight: 500, color: isBlock ? 'var(--ink-s)' : 'var(--ink)' }}>
            {s.member}
          </div>
          {s.flags?.includes('flagged') && <span className="dot dot-warn" />}
          {isNow && <span className="chip chip-ac"><span className="dot dot-ac pulse" /> NOW</span>}
        </div>
        <div className="lbl truncate" style={{ fontSize: 9 }}>{s.type}</div>
      </div>
    </button>
  );
}

function EmptyDetail() {
  return (
    <div className="glass p-10 text-center" style={{ minHeight: 400 }}>
      <div className="lbl">SELECT A SESSION</div>
      <p className="text-sm mt-2" style={{ color: 'var(--ink-s)' }}>Pick a time block to load the AI brief.</p>
    </div>
  );
}

function SessionDetail({ s }: { s: Session }) {
  // Hooks must run unconditionally on every render — call before any early return.
  const [notes, setNotes] = useNotes(s.id, s.notes);
  const isBlock = s.status === 'block';

  if (isBlock) {
    return (
      <div className="glass p-7">
        <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>{s.time}–{s.end} · {s.duration}</div>
        <h3 className="serif text-2xl mb-3" style={{ fontWeight: 400 }}>{s.member}</h3>
        <p className="text-sm" style={{ color: 'var(--ink-s)' }}>{s.type}</p>
        {s.brief && (
          <ul className="mt-4 space-y-2">
            {s.brief.map((b, i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--ink-s)' }}>
                <span className="mono" style={{ color: 'var(--ac)' }}>{String(i + 1).padStart(2, '0')}</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="glass glow p-7">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center serif text-lg"
              style={{
                background: 'color-mix(in srgb, var(--ac) 14%, transparent)',
                color: 'var(--ac-b)',
                border: '1px solid color-mix(in srgb, var(--ac) 30%, transparent)',
              }}
            >
              {s.init}
            </div>
            <div>
              <div className="text-xl" style={{ fontWeight: 600 }}>{s.member}</div>
              <div className="lbl mt-1">{s.time}–{s.end} · {s.type}</div>
            </div>
          </div>
          {s.flags?.includes('flagged') && (
            <span className="chip chip-warn"><span className="dot dot-warn pulse" /> FLAGGED · HIGH-LOAD</span>
          )}
        </div>

        {s.protocol && (
          <div className="mb-5 p-3 rounded-lg" style={{ background: 'color-mix(in srgb, var(--cy) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--cy) 22%, transparent)' }}>
            <div className="lbl mb-1" style={{ color: 'var(--cy)' }}>PROTOCOL</div>
            <div className="text-sm">{s.protocol}</div>
          </div>
        )}

        {s.brief && (
          <>
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>AI BRIEF · ANALYST PRE-READ</div>
            <div className="space-y-2 mb-5">
              {s.brief.map((b, i) => (
                <div key={i} className="text-sm leading-relaxed flex items-start gap-3" style={{ color: 'var(--ink-s)' }}>
                  <span className="mono num text-xs" style={{ color: 'var(--ac)', marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="glass p-7">
        <div className="flex items-center justify-between mb-3">
          <div className="lbl" style={{ color: 'var(--ac-b)' }}>SESSION NOTES</div>
          <div className="flex items-center gap-2">
            <span className="chip">AUTOSAVED</span>
          </div>
        </div>
        <textarea
          className="input"
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes during or after the session…"
          style={{ resize: 'vertical', fontFamily: 'inherit' }}
        />
        <div className="lbl mt-2" style={{ fontSize: 9 }}>VOICE-DICTATION READY · WHISPER ON-DEVICE</div>
      </div>

      <div className="glass p-7">
        <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>AI-SUGGESTED ACTIONS</div>
        <div className="space-y-2">
          {[
            { a: 'Send minimum-effective program template', conf: 'high' },
            { a: 'Schedule mid-cycle check-in May 16', conf: 'med' },
            { a: 'Flag for cohort review next Friday', conf: 'low' },
          ].map((x, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
              <div className="flex-1 text-sm">{x.a}</div>
              <span className={`chip ${x.conf === 'high' ? 'chip-ac' : 'chip'}`}>{x.conf.toUpperCase()}</span>
              <button className="btn-gh" style={{ padding: '6px 10px', fontSize: 10 }}>Queue</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function useNotes(_id: string, init?: string): [string, (v: string) => void] {
  const [val, setVal] = useState(init ?? '');
  return [val, setVal];
}

/* ============================ INBOX VIEW ============================ */

/**
 * Convert a static DraftMsg into BackendDraft shape. Used as the dev-mode
 * fallback when /api/drafts isn't reachable (vite dev doesn't run /api).
 */
function staticToBackend(d: DraftMsg): BackendDraft {
  return {
    id: d.id,
    memberId: d.member.toLowerCase().split(' ')[0],
    memberName: d.member,
    init: d.init,
    draftedAt: d.draftedAt,
    trigger: d.trigger,
    body: d.body,
    conf: d.conf,
    source: d.source,
    state: 'pending',
    isLive: 0,
    model: null,
    inputTokens: null,
    outputTokens: null,
    editedBody: null,
    decisionAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function InboxView() {
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

  // Initial load from backend
  useEffect(() => {
    liveListDrafts()
      .then((data) => {
        setDrafts(data);
        setUsingFallback(false);
      })
      .catch(() => {
        // Backend unreachable (e.g., vite dev). Fall back to static seeds so
        // the UI still works for local development and code review.
        setDrafts(DRAFTS.map(staticToBackend));
        setUsingFallback(true);
      });
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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

/* ============================ CASELOAD VIEW ============================ */

/** Map CASELOAD card label to the Client.status string used in seed data. */
const STATUS_FILTER: Record<string, string> = {
  'On Track': 'on-track',
  'Plateau': 'plateau',
  'Flagged': 'flagged',
  'New': 'new',
};

function CaseloadView({ onOpen }: { onOpen: (id: string) => void }) {
  const [filter, setFilter] = useState<string | null>(null);

  const visibleClients = filter
    ? CLIENTS.filter((c) => c.status === STATUS_FILTER[filter])
    : CLIENTS;

  const filterMeta = filter ? CASELOAD.find((c) => c.label === filter) : null;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-10">
        {CASELOAD.map((x, i) => {
          const active = filter === x.label;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setFilter(active ? null : x.label)}
              className="glass p-5 text-center transition-all"
              data-testid={`caseload-filter-${x.label.replace(/\s+/g, '-').toLowerCase()}`}
              aria-pressed={active}
              style={{
                cursor: 'pointer',
                outline: active ? `2px solid ${x.color}` : '2px solid transparent',
                outlineOffset: '-1px',
                transform: active ? 'translateY(-2px)' : 'none',
                boxShadow: active
                  ? `0 8px 32px color-mix(in srgb, ${x.color} 22%, transparent)`
                  : 'none',
              }}
            >
              <div className="mono text-4xl num mb-2" style={{ fontWeight: 200, color: x.color }}>{x.val}</div>
              <div className="lbl" style={{ color: x.color }}>{x.label}</div>
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="lbl" style={{ color: 'var(--ac-b)' }}>
          {filter
            ? `${filter.toUpperCase()} · YOUR ROSTER`
            : 'YOUR MEMBERS · CLICK A STATUS ABOVE TO FILTER'}
        </div>
        {filter && (
          <button
            type="button"
            onClick={() => setFilter(null)}
            className="text-xs"
            style={{
              color: 'rgba(245,247,250,0.60)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            clear filter
          </button>
        )}
      </div>

      {visibleClients.length === 0 ? (
        <div className="glass p-10 text-center" data-testid="caseload-empty">
          <div className="lbl mb-2">NONE IN YOUR ROSTER</div>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--ink-s)' }}>
            {filterMeta?.val ?? 0} member{(filterMeta?.val ?? 0) === 1 ? '' : 's'} {filter?.toLowerCase()} cohort-wide
            — none currently in your direct caseload. Click another status above or{' '}
            <button
              type="button"
              onClick={() => setFilter(null)}
              style={{
                color: 'var(--ac-b)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              show all
            </button>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {visibleClients.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => onOpen(x.id)}
              className="glass p-6 text-left transition-all client-card"
              data-testid={`caseload-client-${x.id}`}
              aria-label={`Open ${x.name} profile`}
              style={{
                borderColor: 'var(--line-s)',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center serif text-lg"
                  style={{
                    background: 'color-mix(in srgb, var(--ac) 14%, transparent)',
                    color: 'var(--ac-b)',
                    border: '1px solid color-mix(in srgb, var(--ac) 30%, transparent)',
                  }}
                >
                  {x.init}
                </div>
                <div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{x.name}</div>
                  <span
                    className={`chip ${
                      x.status === 'flagged'
                        ? 'chip-warn'
                        : x.status === 'plateau'
                        ? ''
                        : x.status === 'new'
                        ? 'chip-cy'
                        : 'chip-ac'
                    }`}
                    style={{ marginTop: 4 }}
                  >
                    {x.status}
                  </span>
                </div>
              </div>
              <div className="mb-3"><DEXAChart data={x.scans} height={80} /></div>
              <div className="grid grid-cols-3 gap-2 text-[10px] mono" style={{ color: 'var(--ink-m)' }}>
                <div>FAT {x.met.fat}</div>
                <div>LEAN {x.met.lean}</div>
                <div>VISC {x.met.visc}</div>
              </div>
              <div
                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                style={{
                  background: 'color-mix(in srgb, var(--ac) 12%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--ac) 28%, transparent)',
                  color: 'var(--ac-b)',
                  fontWeight: 500,
                }}
              >
                Open full profile <span style={{ fontSize: 14, lineHeight: 1 }}>→</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================ STANDARDS VIEW ============================ */

function StandardsView() {
  return (
    <div>
      <div className="mb-6">
        <div className="lbl mb-3" style={{ color: 'var(--purple)' }}>KALOS STANDARDS · PROTOCOL LIBRARY</div>
        <h2 style={{ fontSize: 'clamp(1.6rem,2.5vw,2rem)', fontWeight: 300, lineHeight: 1.05 }}>
          The house playbook.
        </h2>
        <p className="mt-2 text-sm max-w-xl" style={{ color: 'var(--ink-s)' }}>
          Versioned protocols Telos uses to draft briefs and suggest adjustments. Edited by Harsh + Callum quarterly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {PROTOCOLS.map((p) => (
          <div key={p.code} className="glass p-7">
            <div className="flex items-center justify-between mb-3">
              <span className="chip chip-pur">{p.code}</span>
              <span className="chip">{p.matches} ACTIVE MATCHES</span>
            </div>
            <div className="serif text-xl mb-3" style={{ fontWeight: 400 }}>{p.title}</div>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-s)' }}>{p.body}</p>
            <div className="lbl pt-3" style={{ borderTop: '1px dashed var(--line-s)', fontSize: 9 }}>
              CITATIONS · {p.citations}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ MEMBER DETAIL ============================ */

function MemberDetail({ client: c, onBack }: { client: typeof CLIENTS[number]; onBack: () => void }) {
  return (
    <div className="max-w-[1500px] mx-auto px-8 py-14">
      <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm cursor-pointer" style={{ color: 'var(--ac-b)', background: 'none', border: 'none' }}>
        ← Back to caseload
      </button>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center serif text-2xl" style={{ background: 'color-mix(in srgb, var(--ac) 14%, transparent)', color: 'var(--ac-b)', border: '1px solid color-mix(in srgb, var(--ac) 30%, transparent)' }}>{c.init}</div>
        <div>
          <div className="text-xl" style={{ fontWeight: 600 }}>{c.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`chip ${
                c.status === 'flagged'
                  ? 'chip-warn'
                  : c.status === 'plateau'
                  ? ''
                  : c.status === 'new'
                  ? 'chip-cy'
                  : 'chip-ac'
              }`}
            >
              {c.status}
            </span>
            <span className="lbl">NEXT: {c.next}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <div className="glass p-7">
            <div className="lbl mb-2" style={{ color: 'var(--ac-b)' }}>DEXA BODY COMPOSITION</div>
            <DEXAChart data={c.scans} />
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4" style={{ borderTop: '1px dashed var(--line-s)' }}>
              {[{ l: 'BODY FAT', v: c.met.fat, d: c.met.fatD }, { l: 'LEAN MASS', v: c.met.lean, d: c.met.leanD }, { l: 'VISCERAL', v: c.met.visc, d: c.met.viscD }].map((x, i) => (
                <div key={i}><div className="lbl mb-1">{x.l}</div><div className="mono text-xl num" style={{ fontWeight: 300 }}>{x.v}</div><div className="text-[10px] mono" style={{ color: 'var(--ac)' }}>{x.d}</div></div>
              ))}
            </div>
          </div>
          <div className="glass p-7">
            <div className="lbl mb-2" style={{ color: 'var(--ac-b)' }}>ADHERENCE · 6 WEEKS</div>
            <AdherenceChart data={c.adh} />
          </div>
          <div className="glass p-7">
            <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>WEARABLE SNAPSHOT</div>
            <div className="grid grid-cols-4 gap-4">
              {[{ l: 'HRV', v: c.wear.hrv }, { l: 'SLEEP', v: c.wear.sleep }, { l: 'RECOVERY', v: c.wear.recov }, { l: 'GLUCOSE', v: c.wear.glu }].map((w, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
                  <div className="lbl mb-1">{w.l}</div>
                  <div className="mono text-lg num" style={{ fontWeight: 400, color: (w.v.includes('↓') || w.v.includes('↑')) ? 'var(--warn)' : 'var(--ink)' }}>{w.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass glow p-7">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>AI-SUGGESTED ADJUSTMENT</div>
            <div className="text-sm mb-2"><span className="lbl mr-2">SUGGEST</span>{c.sug.change}</div>
            <div className="text-xs mb-4" style={{ color: 'var(--ink-s)' }}><span className="lbl mr-2">PATTERN</span>{c.sug.reason}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="chip">AI · KALOS CORPUS PATTERN</span>
              <button className="btn-ac">Approve</button>
              <button className="btn-gh">Edit</button>
            </div>
          </div>
        </div>
        <div className="col-span-4 space-y-6">
          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>TRIANGLE</div>
            <TriangleChart scores={c.triangle} projected={c.triProj} size={190} />
          </div>
          <div className="glass glow-cy p-6">
            <div className="lbl mb-2" style={{ color: 'var(--cy)' }}>PRE-SESSION BRIEF</div>
            <div className="text-xs mono mb-4" style={{ color: 'var(--ink-m)' }}>{c.brief.when}</div>
            {c.brief.rows.map((r, i) => (
              <div key={i} className="text-xs leading-relaxed mb-3" style={{ color: 'var(--ink-s)' }}>
                <span className="mono" style={{ color: 'var(--ac-b)' }}>{String(i + 1).padStart(2, '0')} </span>{r}
              </div>
            ))}
            <hr style={{ border: 'none', borderTop: '1px dashed var(--line-s)', margin: '12px 0' }} />
            <div className="lbl mb-2">TALKING POINTS</div>
            {c.brief.pts.map((t, i) => (
              <div key={i} className="text-xs leading-relaxed flex gap-2 mb-2" style={{ color: 'var(--ink-s)' }}>
                <span className="mono num" style={{ color: 'var(--ac-b)', fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
          {c.flag && (
            <div className="p-5 rounded-xl" style={{ background: 'color-mix(in srgb, var(--warn) 7%, transparent)', border: '1px solid color-mix(in srgb, var(--warn) 22%, transparent)' }}>
              <div className="lbl mb-2" style={{ color: 'var(--warn)' }}>FLAG</div>
              <div className="text-xs" style={{ color: '#FFD9A0' }}>{c.flag}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
