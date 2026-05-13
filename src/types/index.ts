/**
 * Telos domain models.
 *
 * These types are the contract between the API layer (src/api) and the UI
 * (src/components, src/pages). The current API implementation in src/api/telosApi.ts
 * returns mocked instances of these types. In production they'd be served from a
 * Hono REST API backed by Postgres + Drizzle (see BUILD_PLAN.md).
 *
 * Keep these UI-agnostic: no React, no styling concerns, no rendering hints.
 */

export type Status = 'on-track' | 'plateau' | 'flagged' | 'new';

export interface Member {
  id: string;
  name: string;
  initials: string;
  status: Exclude<Status, 'new'> | 'new';
  goals: string[];
  analystId: string;
}

export interface DexaScan {
  id: string;
  memberId: string;
  scanNumber: number;
  scanDate: string; // ISO date
  reportId: string;
  bodyFatPct: number;
  leanMassLb: number;
  visceralFatLb: number;
  almi: number;
  bmdGCm2: number;
  tScore: number;
  zScore: number;
  symmetryPct: number;
  segments: {
    head: number;
    leftArm: number;
    rightArm: number;
    trunk: number;
    leftLeg: number;
    rightLeg: number;
  };
  analystNote: string;
}

export interface AdherencePoint {
  weekLabel: string;
  value: number; // 0..100
}

export interface WearableSnapshot {
  hrv: string;
  sleep: string;
  recovery: string;
  glucose: string;
}

export type DraftState = 'pending' | 'approved' | 'edited' | 'declined';

export interface MessageDraft {
  id: string;
  memberId: string;
  draftedAt: string;
  trigger: string;
  body: string;
  confidence: 'high' | 'med' | 'low';
  source: string;
  state: DraftState;
}

export type SessionStatus = 'done' | 'now' | 'next' | 'upcoming' | 'block';

export interface Session {
  id: string;
  startTime: string;
  endTime: string;
  memberName: string;
  memberInitials: string;
  type: string;
  durationLabel: string;
  status: SessionStatus;
  brief?: string[];
  notes?: string;
  protocol?: string;
  flags?: string[];
}

export interface AnalystBrief {
  id: string;
  memberId: string;
  generatedAt: string;
  protocolCitation: string;
  summary: string[];
  talkingPoints: string[];
  flag?: string;
  confidence: 'high' | 'med' | 'low';
}

export interface Analyst {
  id: string;
  name: string;
  initials: string;
  bio: string;
  specialties: string[];
  certification: string;
  location: string;
  matchTags: string[];
  signature: string;
}

export interface ConnectedApp {
  name: string;
  status: 'live' | 'paused' | 'available';
  category: string;
  metrics: string[];
  lastSync: string;
  description: string;
}

export interface FoodEntry {
  time: string;
  meal: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  flag?: 'ok' | 'warn' | 'good';
}

export interface IngredientFlag {
  ingredient: string;
  detail: string;
  level: 'warn' | 'ok';
}

/** Loading / async state primitive used by the UI when calling the API layer. */
export type AsyncResult<T> =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'success'; data: T }
  | { state: 'error'; error: string };
