export interface ChatMsg {
  who: 'me' | 'ai' | 'sys';
  text: string;
  meta?: string;
  /** Stable per-message key. Optional on seed data; assigned at runtime when missing. */
  id?: string;
}

// Maya's between-scan conversation with the Telos (member-facing).
// Voice: direct, measured, warm. Anti-hype. References her real data.
export const MAYA_CHAT: ChatMsg[] = [
  { who: 'sys', text: 'Tue · 7:42 AM · 8 days since DEXA #6' },
  {
    who: 'ai',
    text:
      "Morning, Maya. Looking at the last 72 hours: HRV is down to 38ms, sleep averaged 5:42, and you logged 2 of 4 lifts. I want to flag this — not as a problem yet, as a pattern worth naming.",
  },
  {
    who: 'me',
    text:
      "Yeah. Hard week. I had a long call with my mom about her health and I've been eating around it. Three nights of takeout.",
  },
  {
    who: 'ai',
    text:
      'Thanks for telling me. I want you to know this stays between us — your analyst will only see that adherence dipped and recovery is low. They won\'t see what you just told me unless you ask me to surface it.',
  },
  {
    who: 'ai',
    text:
      "For the next 10 days I'd suggest the minimum-effective program: two lifts (Mon/Thu), 30-min walks after dinner, protein-forward breakfast. Keep the Lingo on but don't optimize around it yet. Sound like something you can hold?",
  },
  { who: 'me', text: 'Yeah I can do that.' },
  {
    who: 'ai',
    text:
      "Good. I'll check in Friday morning. One thing — your scan is May 13. Even if this week is rough, the 4 weeks before it were strong. Visceral fat dropped 0.31lb. That work doesn't disappear.",
    meta: 'SYNTHETIC PATTERN MATCH · 2,840 EXAMPLE ARCS',
  },
];

// Analyst pre-session prep — AI-drafted member messages awaiting analyst review.
// Style: short, specific, designed for a Kalos-style coaching tone.
// Analyst approves / edits / declines before anything reaches the member.
export interface DraftMsg {
  id: string;
  member: string;
  init: string;
  draftedAt: string;
  trigger: string;
  body: string;
  conf: 'high' | 'med' | 'low';
  source: string;
}

export const DRAFTS: DraftMsg[] = [
  {
    id: 'd1',
    member: 'Maya Reyes',
    init: 'M',
    draftedAt: '07:02',
    trigger: 'Adherence 48% · HRV ↓ · sleep ↓ · disclosure signal',
    body:
      "Hey Maya — saw the dip this week. Not pushing. Want to shift you to the minimum-effective program through your May 13 scan: Mon/Thu lifts, post-dinner walks, protein at breakfast. Your last 4 weeks were real work — let's protect that.",
    conf: 'high',
    source: 'Synthetic pattern · 2,840 example arcs · 82% improved with volume reduction',
  },
  {
    id: 'd2',
    member: 'Daniel K.',
    init: 'D',
    draftedAt: '07:04',
    trigger: 'Lean mass plateau S4→S6 · adherence 91% · clean recovery',
    body:
      "Daniel — adherence is dialed, plateau is nutritional, not effort. Add 30g protein at breakfast for 14 days and let me see scan #7. Single variable, single test.",
    conf: 'high',
    source: 'Synthetic pattern · 91% of example cases resolved with one nutrition change',
  },
  {
    id: 'd3',
    member: 'Priya S.',
    init: 'P',
    draftedAt: '07:06',
    trigger: 'On-track · 6 weeks consistent · best trajectory in caseload',
    body:
      "Priya — every vector is moving the right way: -7.1% fat, +4.2lb lean, HRV up. Holding programming through scan #7. We'll talk maintenance vs. continued cut on May 25.",
    conf: 'med',
    source: 'Synthetic pattern · 94% of example arcs continued improvement at this trajectory',
  },
];
