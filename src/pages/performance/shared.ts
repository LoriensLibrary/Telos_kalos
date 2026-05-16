import type { DraftMsg } from '../../data/chat';
import type { BackendDraft } from '../../api/telosApi';

/**
 * Pre-set scenarios for live AI draft generation. Each represents a different
 * coaching context (slip, plateau, stress disclosure) — distinct from the
 * static seed drafts so live drafts are clearly *new* alongside them.
 */
export interface LiveScenario {
  member: string;
  init: string;
  trigger: string;
  metrics: Record<string, string>;
}

export const LIVE_SCENARIOS: LiveScenario[] = [
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

export type DraftState = 'pending' | 'approved' | 'edited' | 'declined';

export const TABS = [
  { id: 'day', label: 'Today' },
  { id: 'inbox', label: 'AI Inbox', badge: 3 },
  { id: 'caseload', label: 'Caseload' },
  { id: 'me', label: 'My Performance' },
  { id: 'standards', label: 'Standards' },
  { id: 'feedback', label: 'Suggestions' },
];

/** Map CASELOAD card label to the Client.status string used in seed data. */
export const STATUS_FILTER: Record<string, string> = {
  'On Track': 'on-track',
  'Plateau': 'plateau',
  'Flagged': 'flagged',
  'New': 'new',
};

/**
 * Convert a static DraftMsg into BackendDraft shape. Used as the dev-mode
 * fallback when /api/drafts isn't reachable (vite dev doesn't run /api).
 */
export function staticToBackend(d: DraftMsg): BackendDraft {
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
