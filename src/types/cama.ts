/**
 * CAMA — Circular Associative Memory Architecture
 *
 * Provenance-aware, longitudinal memory primitives for coaching context.
 * Every retrieved insight can be traced back to the specific MemoryRecords
 * that produced it. No insight is opaque; every claim has receipts.
 *
 * This file defines the public contract. The data in src/data/cama.ts is
 * synthetic, modeled after public coaching workflows. No Kalos member data
 * is used anywhere in this prototype.
 */

export type MemoryType =
  | 'dexa_summary'
  | 'coach_note'
  | 'food_log'
  | 'checkin'
  | 'goal'
  | 'setback'
  | 'preference';

export type Durability = 'provisional' | 'stable' | 'core';

export interface MemoryRecord {
  id: string;
  memberId: string;
  memoryType: MemoryType;
  timestamp: string; // ISO date
  source: string; // e.g. "synthetic_coach_note", "synthetic_dexa", "member_disclosure"
  content: string;
  tags: string[];
  confidence: number; // 0..1
  provenance: string; // human-readable trail
  durability: Durability;
}

/**
 * A Pattern is a derived memory: CAMA inferred it by associating several
 * underlying MemoryRecords. The `derivedFrom` array IS the proof.
 */
export interface Pattern {
  id: string;
  memberId: string;
  summary: string;
  derivedFrom: string[]; // MemoryRecord ids
  signal: 'supportive' | 'cautionary' | 'reinforcing';
}

/**
 * A coach-facing insight surfaced before the next session. Built from
 * one or more Patterns. The `patternIds` field is the second layer of
 * provenance — insight → patterns → memories.
 */
export interface CoachInsight {
  id: string;
  memberId: string;
  headline: string;
  body: string;
  suggestedFollowup: string;
  patternIds: string[];
}
