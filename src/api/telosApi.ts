/**
 * Telos API layer (mock).
 *
 * These functions are the boundary the UI calls. Today they return synthetic
 * data from src/data/*. In production they'd hit a Hono REST API backed by
 * Postgres + Drizzle (see BUILD_PLAN.md, Phase 1).
 *
 * Every function is async and returns typed data. UI components should call
 * these — never reach into src/data/* directly. That separation is what makes
 * swapping in real network calls a single-file change later.
 *
 * Latency is simulated (~80ms) to verify loading states render correctly.
 */

import type {
  Member,
  DexaScan,
  MessageDraft,
  Session,
  Analyst,
  ConnectedApp,
  AnalystBrief,
} from '../types';
import { CLIENTS } from '../data/clients';
import { DRAFTS as RAW_DRAFTS } from '../data/chat';
import { TODAY_SCHEDULE } from '../data/day';
import { ANALYSTS } from '../data/match';
import { CONNECTED_APPS } from '../data/schedule';

const FAKE_LATENCY_MS = 80;
const wait = (ms = FAKE_LATENCY_MS) => new Promise<void>((r) => setTimeout(r, ms));

/* ============================ MEMBERS ============================ */

export async function getMember(memberId: string): Promise<Member> {
  await wait();
  const c = CLIENTS.find((x) => x.id === memberId);
  if (!c) throw new Error(`Member not found: ${memberId}`);
  return {
    id: c.id,
    name: c.name,
    initials: c.init,
    status: c.status,
    goals: c.goals,
    analystId: 'james',
  };
}

export async function listMembers(): Promise<Member[]> {
  await wait();
  return CLIENTS.map((c) => ({
    id: c.id,
    name: c.name,
    initials: c.init,
    status: c.status,
    goals: c.goals,
    analystId: 'james',
  }));
}

/* ============================ DEXA SCANS ============================ */

export async function listScansForMember(memberId: string): Promise<DexaScan[]> {
  await wait();
  const c = CLIENTS.find((x) => x.id === memberId);
  if (!c) throw new Error(`Member not found: ${memberId}`);
  // The raw client data only stores fat/lean pairs per scan. Production would
  // include all DEXA fields; for the mock we hydrate from the latest values
  // and apply a deterministic gradient back through scans for the rest.
  return c.scans.map((scan, i) => ({
    id: `${memberId}-scan-${i + 1}`,
    memberId,
    scanNumber: i + 1,
    scanDate: new Date(2025, 10 + i, 5).toISOString(),
    reportId: `KAL-DXA-${i + 1}`,
    bodyFatPct: scan.fat,
    leanMassLb: scan.lean,
    visceralFatLb: 1.45 - i * 0.06,
    almi: 7.51 + i * 0.07,
    bmdGCm2: 1.10 + i * 0.004,
    tScore: 0.4 + i * 0.04,
    zScore: 0.6 + i * 0.04,
    symmetryPct: 95.8 + i * 0.2,
    segments: {
      head: 3.6 + i * 0.04,
      leftArm: 6.0 + i * 0.08,
      rightArm: 6.2 + i * 0.08,
      trunk: 46.4 + i * 0.36,
      leftLeg: 23.0 + i * 0.16,
      rightLeg: 22.4 + i * 0.16,
    },
    analystNote: '',
  }));
}

/* ============================ DRAFTS / AI INBOX ============================ */

export async function listPendingDrafts(): Promise<MessageDraft[]> {
  await wait();
  return RAW_DRAFTS.map((d) => ({
    id: d.id,
    memberId: d.member.toLowerCase().split(' ')[0],
    draftedAt: d.draftedAt,
    trigger: d.trigger,
    body: d.body,
    confidence: d.conf,
    source: d.source,
    state: 'pending' as const,
  }));
}

export async function approveDraft(draftId: string, edited: boolean): Promise<MessageDraft> {
  await wait();
  const drafts = await listPendingDrafts();
  const d = drafts.find((x) => x.id === draftId);
  if (!d) throw new Error(`Draft not found: ${draftId}`);
  return { ...d, state: edited ? 'edited' : 'approved' };
}

export async function declineDraft(draftId: string): Promise<MessageDraft> {
  await wait();
  const drafts = await listPendingDrafts();
  const d = drafts.find((x) => x.id === draftId);
  if (!d) throw new Error(`Draft not found: ${draftId}`);
  return { ...d, state: 'declined' };
}

/* ============================ SCHEDULE / SESSIONS ============================ */

export async function getDaySchedule(): Promise<Session[]> {
  await wait();
  return TODAY_SCHEDULE.map((s) => ({
    id: s.id,
    startTime: s.time,
    endTime: s.end,
    memberName: s.member,
    memberInitials: s.init,
    type: s.type,
    durationLabel: s.duration,
    status: s.status,
    brief: s.brief,
    notes: s.notes,
    protocol: s.protocol,
    flags: s.flags,
  }));
}

/* ============================ ANALYSTS ============================ */

export async function listAnalysts(): Promise<Analyst[]> {
  await wait();
  return ANALYSTS.map((a) => ({
    id: a.id,
    name: a.name,
    initials: a.initials,
    bio: a.bio,
    specialties: a.specialties,
    certification: a.cert,
    location: a.location,
    matchTags: a.match,
    signature: a.signature,
  }));
}

export async function matchAnalyst(tags: string[]): Promise<Analyst> {
  await wait();
  const analysts = await listAnalysts();
  const ranked = [...analysts]
    .map((a) => ({ a, score: a.matchTags.filter((m) => tags.includes(m)).length }))
    .sort((x, y) => y.score - x.score);
  return ranked[0].a;
}

/* ============================ INTEGRATIONS ============================ */

export async function listConnectedApps(): Promise<ConnectedApp[]> {
  await wait();
  return CONNECTED_APPS.map((a) => ({
    name: a.name,
    status: a.status,
    category: a.category,
    metrics: a.metrics,
    lastSync: a.lastSync,
    description: a.desc,
  }));
}

/* ============================ ANALYST BRIEFS ============================ */

export async function getBriefForSession(sessionId: string): Promise<AnalystBrief | null> {
  await wait();
  const sched = await getDaySchedule();
  const s = sched.find((x) => x.id === sessionId);
  if (!s || !s.brief) return null;
  return {
    id: `brief-${sessionId}`,
    memberId: s.memberInitials.toLowerCase(),
    generatedAt: new Date().toISOString(),
    protocolCitation: s.protocol ?? 'Kalos Standard',
    summary: s.brief,
    talkingPoints: [],
    flag: s.flags?.[0],
    confidence: 'high',
  };
}

/* ============================ LIVE BACKEND (Phase 2) ============================
 *
 * These helpers call the real Hono REST API at /api/* (Postgres-backed via
 * Neon + Drizzle). Used by AI Inbox today; other surfaces will migrate in
 * subsequent passes. Mock helpers above remain so existing tests + unmigrated
 * callers keep working — this is how production migrations actually happen,
 * progressively, not in one bang.
 */

/** Shape returned by GET /api/drafts — mirrors the Postgres `message_drafts` row. */
export interface BackendDraft {
  id: string;
  memberId: string | null;
  memberName: string;
  init: string;
  draftedAt: string;
  trigger: string;
  body: string;
  conf: 'high' | 'med' | 'low';
  source: string;
  state: 'pending' | 'approved' | 'edited' | 'declined';
  isLive: number;
  model: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  editedBody: string | null;
  decisionAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function liveListDrafts(stateFilter?: BackendDraft['state']): Promise<BackendDraft[]> {
  const url = stateFilter ? `/api/drafts?state=${stateFilter}` : '/api/drafts';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`liveListDrafts failed: ${res.status}`);
  return res.json();
}

export async function liveApproveDraft(id: string): Promise<BackendDraft> {
  const res = await fetch(`/api/drafts/${encodeURIComponent(id)}/approve`, { method: 'POST' });
  if (!res.ok) throw new Error(`liveApproveDraft failed: ${res.status}`);
  return res.json();
}

export async function liveEditDraft(id: string, body: string): Promise<BackendDraft> {
  const res = await fetch(`/api/drafts/${encodeURIComponent(id)}/edit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error(`liveEditDraft failed: ${res.status}`);
  return res.json();
}

export async function liveDeclineDraft(id: string): Promise<BackendDraft> {
  const res = await fetch(`/api/drafts/${encodeURIComponent(id)}/decline`, { method: 'POST' });
  if (!res.ok) throw new Error(`liveDeclineDraft failed: ${res.status}`);
  return res.json();
}

/** Health check — used by `GET /api/health` to verify DB connectivity. */
export async function liveHealth(): Promise<{ ok: boolean; members?: number; timestamp?: string; error?: string }> {
  try {
    const res = await fetch('/api/health');
    return res.json();
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'unknown' };
  }
}
