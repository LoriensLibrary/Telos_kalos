// Coach matching — mirrors how Kalos actually does it:
// slot-based assignment by location/time + soft-match by goals/style.

export interface Question {
  id: string;
  label: string;
  options: { id: string; label: string; tag: string }[];
}

export const MATCH_QUESTIONS: Question[] = [
  {
    id: 'goal',
    label: 'What are you optimizing for first?',
    options: [
      { id: 'fat', label: 'Lose fat · recomp', tag: 'body-comp' },
      { id: 'muscle', label: 'Build muscle · strength', tag: 'strength' },
      { id: 'longevity', label: 'Longevity · healthspan', tag: 'longevity' },
      { id: 'sport', label: 'Sport performance · endurance', tag: 'endurance' },
      { id: 'aesthetic', label: 'Aesthetics · symmetry', tag: 'aesthetic' },
    ],
  },
  {
    id: 'history',
    label: 'How much training history?',
    options: [
      { id: 'new', label: 'Starting fresh', tag: 'beginner' },
      { id: 'rusty', label: '6 months – 2 years off', tag: 'beginner' },
      { id: 'consistent', label: '2+ years consistent', tag: 'intermediate' },
      { id: 'advanced', label: '5+ years · advanced', tag: 'advanced' },
    ],
  },
  {
    id: 'style',
    label: 'How do you respond to coaching?',
    options: [
      { id: 'direct', label: 'Direct · no-nonsense · numbers', tag: 'direct' },
      { id: 'encouraging', label: 'Encouraging · steady wins', tag: 'encouraging' },
      { id: 'data', label: 'Heavy data · charts · protocols', tag: 'data' },
      { id: 'holistic', label: 'Holistic · stress + sleep + mind', tag: 'holistic' },
    ],
  },
  {
    id: 'schedule',
    label: "What's your week like?",
    options: [
      { id: 'morning', label: 'Mornings before work', tag: 'morning' },
      { id: 'evening', label: 'Evenings only', tag: 'evening' },
      { id: 'flexible', label: 'Flexible / WFH', tag: 'flexible' },
      { id: 'tight', label: 'Tight · 30-min windows', tag: 'tight' },
    ],
  },
];

export interface Analyst {
  id: string;
  name: string;
  initials: string;
  bio: string;
  specialties: string[];
  cert: string;
  location: string;
  match: string[];
  signature: string;
}

// Real Kalos analysts pulled from livekalos.com/team
export const ANALYSTS: Analyst[] = [
  {
    id: 'callum',
    name: 'Callum Parker',
    initials: 'CP',
    bio: 'Co-Founder. Cambridge Economics, 800m PR 1:54, 1000lb club. Strength + endurance.',
    specialties: ['Strength', 'Endurance', 'Performance'],
    cert: 'NASM CPT',
    location: 'SF · Palo Alto',
    match: ['strength', 'endurance', 'sport', 'direct', 'advanced'],
    signature: 'Hardest worker on the team. Strong + fast same week.',
  },
  {
    id: 'james',
    name: 'James Wei',
    initials: 'J',
    bio: 'Metabolic health · body composition · busy-professional protocols.',
    specialties: ['Body-comp', 'Metabolic', 'Longevity'],
    cert: 'NASM CPT/CNC',
    location: 'SF studio',
    match: ['fat', 'body-comp', 'longevity', 'data', 'flexible'],
    signature: 'Data-first. Protocols citing matched arcs. Calm under load.',
  },
  {
    id: 'max',
    name: 'Max Shakespeare',
    initials: 'MS',
    bio: 'Harvard Psych · Stanford Public Health. Behavior change + longevity.',
    specialties: ['Behavior', 'Longevity', 'Wellbeing'],
    cert: 'NASM CPT · MPH',
    location: 'Palo Alto',
    match: ['longevity', 'holistic', 'beginner', 'rusty'],
    signature: 'Where the body meets the brain. Slow wins, sustained.',
  },
  {
    id: 'noah',
    name: 'Noah Feinberg',
    initials: 'NF',
    bio: 'Mayo Clinic + UFC strength. NHL + Olympic strength & conditioning.',
    specialties: ['Strength', 'Sport', 'Power'],
    cert: 'CSCS · MSc',
    location: 'SF · Campbell',
    match: ['muscle', 'sport', 'advanced', 'data', 'direct'],
    signature: 'Olympic-grade S&C. Elite athletes who want serious work.',
  },
  {
    id: 'morgan',
    name: 'Morgan Mitchell',
    initials: 'MM',
    bio: 'KPMG consultant + Equinox top trainer 2023/24. Strength + endurance.',
    specialties: ['Strength', 'Endurance', 'Aesthetic'],
    cert: 'NASM CPT',
    location: 'SF studio',
    match: ['aesthetic', 'endurance', 'encouraging', 'morning'],
    signature: 'Aesthetic recomp + race training. Polished + warm.',
  },
  {
    id: 'matteo',
    name: 'Matteo Ascherio-Victoria',
    initials: 'MA',
    bio: 'Strength + mobility + movement + yoga. Pain-free for life framing.',
    specialties: ['Mobility', 'Strength', 'Movement'],
    cert: 'NASM CPT · 200hr Yoga',
    location: 'Palo Alto',
    match: ['holistic', 'beginner', 'longevity', 'tight'],
    signature: 'Move better, then stronger. Yoga + strength bridge.',
  },
];

// Simple match scoring — sum tag matches per analyst
export function scoreAnalysts(answers: Record<string, string>): Analyst[] {
  const tags = Object.values(answers);
  return [...ANALYSTS]
    .map((a) => ({ a, score: a.match.filter((m) => tags.includes(m)).length }))
    .sort((x, y) => y.score - x.score)
    .map(({ a }) => a);
}

/* ===================== COACH-SIDE EMPLOYEE DASHBOARD ===================== */

export interface CoachKpi {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
  detail: string;
}

export const JAMES_KPIS: CoachKpi[] = [
  { label: 'ACTIVE MEMBERS', value: '23', delta: '+2 vs last mo', trend: 'up', detail: 'capacity 28' },
  { label: 'RETENTION (90d)', value: '94%', delta: '+3pt vs cohort', trend: 'up', detail: 'team avg 88%' },
  { label: 'AVG FAT-LOSS', value: '-1.4%', delta: 'per 4 wks', trend: 'up', detail: 'cohort -1.1%' },
  { label: 'AVG LEAN GAIN', value: '+0.8lb', delta: 'per 4 wks', trend: 'up', detail: 'cohort +0.6lb' },
  { label: 'CHECK-INS / WK', value: '92%', delta: 'completion', trend: 'up', detail: 'on cadence' },
  { label: 'NPS', value: '74', delta: '+8 QoQ', trend: 'up', detail: 'team 62' },
];

export interface CohortMember {
  init: string;
  name: string;
  weeks: number;
  fatΔ: string;
  leanΔ: string;
  adherence: number;
  status: 'on-track' | 'flagged' | 'plateau' | 'new';
}

export const JAMES_COHORT: CohortMember[] = [
  { init: 'M', name: 'Maya Reyes', weeks: 24, fatΔ: '-3.7%', leanΔ: '+4.0lb', adherence: 78, status: 'flagged' },
  { init: 'D', name: 'Daniel K.', weeks: 24, fatΔ: '-2.2%', leanΔ: '+3.4lb', adherence: 91, status: 'plateau' },
  { init: 'P', name: 'Priya S.', weeks: 24, fatΔ: '-7.1%', leanΔ: '+4.2lb', adherence: 96, status: 'on-track' },
  { init: 'L', name: 'Lena O.', weeks: 18, fatΔ: '-3.4%', leanΔ: '+2.1lb', adherence: 84, status: 'plateau' },
  { init: 'A', name: 'Aaron M.', weeks: 16, fatΔ: '-2.8%', leanΔ: '+1.8lb', adherence: 88, status: 'on-track' },
  { init: 'MT', name: 'Marcus T.', weeks: 0, fatΔ: 'baseline', leanΔ: 'baseline', adherence: 0, status: 'new' },
];

export interface ExperimentLog {
  id: string;
  protocol: string;
  cohortSize: number;
  duration: string;
  result: string;
  conf: 'high' | 'med' | 'exploratory';
}

export const EXPERIMENTS: ExperimentLog[] = [
  {
    id: 'e1',
    protocol: '+30g protein at breakfast (plateau-break)',
    cohortSize: 24,
    duration: '4 weeks',
    result: '91% resolved plateau · avg +0.6lb lean recovered',
    conf: 'high',
  },
  {
    id: 'e2',
    protocol: 'Volume cut to 70% during 5+ days low HRV',
    cohortSize: 18,
    duration: '6 weeks',
    result: 'Adherence retained across cohort · no significant regression',
    conf: 'high',
  },
  {
    id: 'e3',
    protocol: 'Creatine 5g/d for stalled lean mass',
    cohortSize: 12,
    duration: '8 weeks',
    result: '67% +1.2lb lean within 4 wks · 25% no change',
    conf: 'med',
  },
  {
    id: 'e4',
    protocol: 'Post-dinner walk 15m for glucose spikes',
    cohortSize: 9,
    duration: '3 weeks',
    result: 'Spike count -38% · running cohort, results pending',
    conf: 'exploratory',
  },
];

export const COMP_THIS_MONTH = {
  signups: 4,
  retentions: 2,
  nextPayout: 'May 30',
};

export const CERTIFICATIONS = [
  { name: 'NASM CPT', status: 'current', expires: 'Mar 2027' },
  { name: 'NASM CNC', status: 'current', expires: 'Sep 2026' },
  { name: 'Precision Nutrition L1', status: 'in-progress', expires: '—' },
  { name: 'CPR / First Aid', status: 'renewal-due', expires: 'Jun 2026' },
];

export const TEAM_STANDING = {
  rank: 3,
  total: 14,
  category: 'Body-comp specialty',
  detail: 'Avg member fat loss · top quartile',
};
