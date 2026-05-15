/**
 * Synthetic CAMA seed for the Proof Layer.
 *
 * This data is fabricated, modeled after public coaching workflows.
 * No Kalos member data is used. The synthetic member ("Maya") is the
 * same persona used elsewhere in the demo.
 *
 * The point of this file is to make one claim auditable end-to-end:
 *
 *   MemoryRecords  →  Patterns  →  AnalystInsight
 *
 * Each layer references the layer beneath it by id, so a reviewer can
 * click any insight and trace it back to the raw memory that produced it.
 */

import type { AnalystInsight, MemoryRecord, Pattern } from '../types/cama';

const MAYA = 'M-maya';

export const memoryRecords: MemoryRecord[] = [
  {
    id: 'mem-001',
    memberId: MAYA,
    memoryType: 'goal',
    timestamp: '2026-01-08',
    source: 'member_intake',
    content: 'Want to feel strong, not look thin. Energy for hikes with my kid matters more than the scale.',
    tags: ['identity', 'energy', 'family'],
    confidence: 0.95,
    provenance: 'synthetic intake form',
    durability: 'core',
  },
  {
    id: 'mem-002',
    memberId: MAYA,
    memoryType: 'dexa_summary',
    timestamp: '2026-01-12',
    source: 'synthetic_dexa',
    content: 'Baseline scan. BF 28.4%. Lean mass 102.1 lb. Visceral 1.2 lb. Asymmetry mild (R-arm dominant).',
    tags: ['baseline', 'lean_mass', 'asymmetry'],
    confidence: 0.99,
    provenance: 'synthetic DEXA #1',
    durability: 'core',
  },
  {
    id: 'mem-003',
    memberId: MAYA,
    memoryType: 'analyst_note',
    timestamp: '2026-01-22',
    source: 'synthetic_analyst_note',
    content: 'First strategy session. Leaned strict/structured tone with adherence targets.',
    tags: ['tone:strict', 'session', 'early'],
    confidence: 0.92,
    provenance: 'synthetic analyst log',
    durability: 'stable',
  },
  {
    id: 'mem-004',
    memberId: MAYA,
    memoryType: 'setback',
    timestamp: '2026-02-04',
    source: 'synthetic_checkin',
    content: 'Disengaged after week of strict targets. Missed two check-ins. "Feels like another job."',
    tags: ['disengagement', 'tone:strict', 'overload'],
    confidence: 0.88,
    provenance: 'synthetic member disclosure',
    durability: 'stable',
  },
  {
    id: 'mem-005',
    memberId: MAYA,
    memoryType: 'analyst_note',
    timestamp: '2026-02-08',
    source: 'synthetic_analyst_note',
    content: 'Switched to supportive accountability — softened tone, single weekly anchor goal. Re-engaged within 3 days.',
    tags: ['tone:supportive', 'recovery', 'session'],
    confidence: 0.93,
    provenance: 'synthetic analyst log',
    durability: 'stable',
  },
  {
    id: 'mem-006',
    memberId: MAYA,
    memoryType: 'dexa_summary',
    timestamp: '2026-02-18',
    source: 'synthetic_dexa',
    content: 'Scan #2. BF 27.6%. Lean mass 103.0 lb (+0.9). Visceral 1.1 lb. Asymmetry holding.',
    tags: ['lean_mass:gain', 'progress'],
    confidence: 0.99,
    provenance: 'synthetic DEXA #2',
    durability: 'core',
  },
  {
    id: 'mem-007',
    memberId: MAYA,
    memoryType: 'checkin',
    timestamp: '2026-02-25',
    source: 'synthetic_checkin',
    content: 'Sunday meal-planning. "Felt in control all week — protein on every plate."',
    tags: ['meal_planning', 'consistency', 'autonomy'],
    confidence: 0.9,
    provenance: 'synthetic member checkin',
    durability: 'stable',
  },
  {
    id: 'mem-008',
    memberId: MAYA,
    memoryType: 'food_log',
    timestamp: '2026-03-04',
    source: 'synthetic_food_log',
    content: '6-day streak. Avg protein 128g. Pre-planned meals 5/7 days.',
    tags: ['meal_planning', 'protein:on_target', 'streak'],
    confidence: 0.95,
    provenance: 'synthetic logged meals',
    durability: 'provisional',
  },
  {
    id: 'mem-009',
    memberId: MAYA,
    memoryType: 'dexa_summary',
    timestamp: '2026-03-12',
    source: 'synthetic_dexa',
    content: 'Scan #3. BF 26.9%. Lean mass 104.3 lb (+1.3). Visceral 1.0 lb. Symmetry improving.',
    tags: ['lean_mass:gain', 'progress', 'symmetry'],
    confidence: 0.99,
    provenance: 'synthetic DEXA #3',
    durability: 'core',
  },
  {
    id: 'mem-010',
    memberId: MAYA,
    memoryType: 'setback',
    timestamp: '2026-03-20',
    source: 'synthetic_checkin',
    content: 'Work travel — 3 nights of takeout, two missed workouts. "Couldn\'t see the plan working from a hotel room."',
    tags: ['travel', 'disruption', 'consistency:drop'],
    confidence: 0.9,
    provenance: 'synthetic member disclosure',
    durability: 'stable',
  },
  {
    id: 'mem-011',
    memberId: MAYA,
    memoryType: 'analyst_note',
    timestamp: '2026-03-24',
    source: 'synthetic_analyst_note',
    content: 'Travel debrief. Co-built a 4-meal "hotel protocol" for next trip. No correction, just preparation.',
    tags: ['tone:supportive', 'travel_protocol', 'preempt'],
    confidence: 0.94,
    provenance: 'synthetic analyst log',
    durability: 'stable',
  },
  {
    id: 'mem-012',
    memberId: MAYA,
    memoryType: 'setback',
    timestamp: '2026-04-01',
    source: 'member_disclosure',
    content: 'Hard call with mom about her health. Three nights of takeout, no workouts. Member-shared, sealed to analyst view.',
    tags: ['family_stress', 'high_cognitive_load', 'private'],
    confidence: 0.87,
    provenance: 'synthetic private disclosure (pattern-only to analyst)',
    durability: 'provisional',
  },
  {
    id: 'mem-013',
    memberId: MAYA,
    memoryType: 'analyst_note',
    timestamp: '2026-04-04',
    source: 'synthetic_analyst_note',
    content: 'High-load week detected via pattern, source sealed. Recommended simplified structure 2–4 weeks. Do not press.',
    tags: ['tone:supportive', 'simplification', 'preempt'],
    confidence: 0.91,
    provenance: 'synthetic analyst log',
    durability: 'stable',
  },
  {
    id: 'mem-014',
    memberId: MAYA,
    memoryType: 'checkin',
    timestamp: '2026-04-15',
    source: 'synthetic_checkin',
    content: 'Back to Sunday meal-planning. "Easier when nothing else is on fire."',
    tags: ['meal_planning', 'recovery'],
    confidence: 0.9,
    provenance: 'synthetic member checkin',
    durability: 'stable',
  },
  {
    id: 'mem-015',
    memberId: MAYA,
    memoryType: 'dexa_summary',
    timestamp: '2026-04-22',
    source: 'synthetic_dexa',
    content: 'Scan #4. BF 27.0%. Lean mass 104.5 lb (holding). Visceral 1.0 lb. Plateau under high-load weeks.',
    tags: ['plateau', 'holding', 'stress_correlate'],
    confidence: 0.99,
    provenance: 'synthetic DEXA #4',
    durability: 'core',
  },
  {
    id: 'mem-016',
    memberId: MAYA,
    memoryType: 'preference',
    timestamp: '2026-05-05',
    source: 'member_disclosure',
    content: 'Prefers short Monday check-ins. Asks analyst to skip Friday pushes when work is heavy.',
    tags: ['cadence', 'tone:supportive', 'autonomy'],
    confidence: 0.93,
    provenance: 'synthetic member preference',
    durability: 'core',
  },
];

export const patterns: Pattern[] = [
  {
    id: 'pat-stress',
    memberId: MAYA,
    summary:
      'Consistency drops sharply during high-load weeks (work travel, family stress). Recovery is fast when the analyst softens tone and simplifies structure rather than pressing.',
    derivedFrom: ['mem-004', 'mem-010', 'mem-012', 'mem-013', 'mem-015'],
    signal: 'cautionary',
  },
  {
    id: 'pat-planning',
    memberId: MAYA,
    summary:
      'Lean-mass gains correlate with weeks of consistent meal planning (Sunday anchor + pre-planned protein). Plateau weeks align with disrupted planning, not effort.',
    derivedFrom: ['mem-006', 'mem-007', 'mem-008', 'mem-009', 'mem-014', 'mem-015'],
    signal: 'reinforcing',
  },
  {
    id: 'pat-tone',
    memberId: MAYA,
    summary:
      'Strict accountability backfires; supportive accountability re-engages within days. Pattern verified across two cycles. Member preference confirms.',
    derivedFrom: ['mem-003', 'mem-004', 'mem-005', 'mem-011', 'mem-013', 'mem-016'],
    signal: 'supportive',
  },
];

export const analystInsight: AnalystInsight = {
  id: 'ins-next-session',
  memberId: MAYA,
  headline: 'Open with stress load, not the scan numbers.',
  body:
    "Maya is in a high-load period (mem-012 surfaced as pattern, source sealed). Her plateau at scan #4 aligns with stress, not effort — meal-planning was disrupted, but adherence intent held. Strict accountability has backfired in this profile; supportive accountability re-engages within days.",
  suggestedFollowup:
    "Ask about stress load first. Then anchor one small meal-planning goal for the week — Sunday prep, single protein target. Skip the Friday push. Revisit lean-mass trajectory at the next scan, not this session.",
  patternIds: ['pat-stress', 'pat-planning', 'pat-tone'],
};

export const syntheticMember = {
  id: MAYA,
  name: 'Maya R.',
  initials: 'MR',
  scanCount: 4,
  monthsActive: 5,
} as const;
