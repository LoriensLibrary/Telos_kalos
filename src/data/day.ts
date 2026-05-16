// Member daily state — Maya, May 13 2026
export interface FoodEntry {
  time: string;
  meal: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  flag?: 'ok' | 'warn' | 'good';
}

export interface Workout {
  time: string;
  title: string;
  detail: string;
  duration: string;
  status: 'done' | 'now' | 'upcoming' | 'missed';
  rpe?: number;
}

export interface SleepNight {
  date: string;
  total: number; // hours
  deep: number;
  rem: number;
  hrv: number;
  rhr: number;
  score: number;
}

export const TODAY_RINGS = [
  { label: 'MOVE', pct: 68, v: '412', sub: 'kcal · 600' },
  { label: 'STAND', pct: 75, v: '9', sub: 'hrs · 12' },
  { label: 'EXERCISE', pct: 40, v: '12', sub: 'min · 30' },
  { label: 'PROTEIN', pct: 52, v: '57g', sub: 'of 110g' },
];

export const HYDRATION = { current: 1.8, target: 3.0 }; // liters

export const FOOD_LOG: FoodEntry[] = [
  { time: '07:14', meal: 'Greek yogurt · berries · granola', kcal: 320, protein: 24, carbs: 38, fat: 8, flag: 'good' },
  { time: '10:02', meal: 'Cold brew · oat milk', kcal: 60, protein: 1, carbs: 8, fat: 2 },
  { time: '12:38', meal: 'Chicken salad · olive oil · sourdough', kcal: 540, protein: 32, carbs: 42, fat: 22, flag: 'ok' },
];

export const WORKOUTS_WEEK: Workout[] = [
  { time: 'MON', title: 'Lower · A', detail: 'Squat 4×5 · RDL 3×8 · split squat', duration: '52m', status: 'done', rpe: 7 },
  { time: 'TUE', title: 'Zone-2', detail: '45m bike · HR 128', duration: '45m', status: 'done', rpe: 4 },
  { time: 'WED', title: 'Upper · A', detail: 'Bench 4×6 · row · OHP', duration: '0m', status: 'missed' },
  { time: 'THU', title: 'Lower · B', detail: 'Hinge focus · single-leg', duration: '48m', status: 'done', rpe: 7 },
  { time: 'FRI', title: 'Zone-2', detail: '40m walk-jog · HR 130', duration: '0m', status: 'missed' },
  { time: 'SAT', title: 'Upper · B', detail: 'Pull-up · push · curl', duration: '0m', status: 'upcoming' },
  { time: 'SUN', title: 'Active rest', detail: 'Easy walk · mobility · light stretch', duration: '0m', status: 'upcoming' },
];

export const TODAY_WORKOUT: Workout = {
  time: '17:30',
  title: 'Upper · B · Push focus',
  detail: 'Bench 4×6 @ 95lb · Incline DB 3×10 · Cable row 3×12 · Tricep · Face pull',
  duration: '45m',
  status: 'now',
};

export const SLEEP_NIGHTS: SleepNight[] = [
  { date: 'MAY 6', total: 7.6, deep: 1.2, rem: 1.8, hrv: 54, rhr: 58, score: 88 },
  { date: 'MAY 7', total: 7.2, deep: 1.0, rem: 1.6, hrv: 51, rhr: 60, score: 82 },
  { date: 'MAY 8', total: 6.4, deep: 0.8, rem: 1.4, hrv: 46, rhr: 62, score: 71 },
  { date: 'MAY 9', total: 5.9, deep: 0.7, rem: 1.2, hrv: 42, rhr: 64, score: 64 },
  { date: 'MAY 10', total: 5.7, deep: 0.6, rem: 1.1, hrv: 40, rhr: 66, score: 60 },
  { date: 'MAY 11', total: 5.4, deep: 0.5, rem: 1.0, hrv: 38, rhr: 67, score: 55 },
  { date: 'MAY 12', total: 5.7, deep: 0.7, rem: 1.2, hrv: 38, rhr: 66, score: 58 },
];

// CGM glucose trace (24h, mg/dL, every 30m = 48 points)
export const GLUCOSE_TRACE = [
  92, 90, 88, 87, 86, 85, 86, 88, 95, 112, 138, 152, 144, 128, 118, 110, 104,
  98, 95, 102, 128, 148, 162, 158, 142, 124, 112, 105, 100, 98, 96, 99, 110,
  138, 168, 174, 162, 144, 128, 116, 108, 102, 96, 94, 92, 90, 89, 88,
];

export const GLUCOSE_STATS = { avg: 114, peak: 174, tir: 78, spikes: 3, gmi: '5.6%' };

export const SUPPLEMENTS = [
  { name: 'Creatine monohydrate', dose: '5g', when: 'AM · daily', adh: 95 },
  { name: 'Vitamin D3', dose: '4000 IU', when: 'AM · daily', adh: 88 },
  { name: 'Omega-3 EPA/DHA', dose: '2g', when: 'PM · meal', adh: 76 },
  { name: 'Magnesium glycinate', dose: '400mg', when: 'PM · sleep', adh: 92 },
];

export const GOALS = [
  { name: 'Visceral fat < 1.0 lb', start: 1.45, current: 1.14, target: 1.0, unit: 'lb', dir: 'down' as const },
  { name: 'Lean mass +3 lb by Q3', start: 104.2, current: 108.2, target: 107.2, unit: 'lb', dir: 'up' as const },
  { name: 'Glucose TIR > 85%', start: 62, current: 78, target: 85, unit: '%', dir: 'up' as const },
  { name: 'HRV baseline > 55 ms', start: 44, current: 38, target: 55, unit: 'ms', dir: 'up' as const },
];

export const PROGRAMS = [
  { name: 'Minimum-Effective Block', weeks: '2 of 4', detail: '2 lifts/wk · walks · breakfast protein', active: true },
  { name: 'Strength-build Phase 2', weeks: 'queued', detail: '4 lifts/wk · 8-week hypertrophy', active: false },
];

/* =================== PERFORMANCE / ANALYST SIDE =================== */

export type SessionStatus = 'done' | 'now' | 'next' | 'upcoming' | 'block';

export interface Session {
  id: string;
  time: string;
  end: string;
  member: string;
  init: string;
  type: string;
  duration: string;
  status: SessionStatus;
  brief?: string[];
  notes?: string;
  protocol?: string;
  flags?: string[];
}

export const TODAY_SCHEDULE: Session[] = [
  {
    id: 's0',
    time: '07:30',
    end: '08:30',
    member: 'Morning prep',
    init: '·',
    type: 'DAY PLANNING · AI BRIEF',
    duration: '1h',
    status: 'done',
    brief: [
      'Reviewed overnight wearable data for 8 active members.',
      'Drafted 3 between-session messages awaiting your approval.',
      'Flagged Maya Reyes: 6-night sleep deficit + adherence dip.',
    ],
  },
  {
    id: 's1',
    time: '09:00',
    end: '09:30',
    member: 'Maya Reyes',
    init: 'M',
    type: 'DEXA REVIEW · SCAN #7 PREP',
    duration: '30m',
    status: 'now',
    protocol: 'Visceral-fat reduction · Kalos Standard v2.3',
    flags: ['flagged', 'high-load context'],
    brief: [
      'Fat -1.2% scan 5→6. Lean +0.4 lb. Decelerating.',
      'Strong first 2 weeks then drift. 3 of 6 lifts missed.',
      'HRV depressed (38 ms). Sleep avg 5:42. Lingo: 3 spikes/d post-dinner.',
      'Pattern flag: high cognitive-load period — last 72h. Do not press.',
    ],
    notes: 'Lead with progress. Frame as "we are protecting work already done." Avoid optimizing — minimum-effective block through 5/13.',
  },
  {
    id: 's2',
    time: '10:00',
    end: '10:20',
    member: 'Daniel K.',
    init: 'D',
    type: 'STRENGTH CHECK-IN',
    duration: '20m',
    status: 'next',
    protocol: 'Hypertrophy plateau-break · Kalos Standard v1.8',
    brief: [
      'Lean mass plateau S4→S6 (+0.1 lb). Fat loss stalling.',
      '91% adherence. Recovery green. Programming issue, not effort.',
      'Single-variable test: +30g protein @ breakfast for 14 days.',
    ],
    notes: 'Ask about appetite. If breakfast protein feels forced, suggest whey shake. Hold all other variables.',
  },
  {
    id: 's3',
    time: '10:30',
    end: '11:00',
    member: 'Priya S.',
    init: 'P',
    type: 'PROGRAMMING REVIEW',
    duration: '30m',
    status: 'upcoming',
    protocol: 'Longevity recomp · Kalos Standard v3.1',
    brief: [
      'Best trajectory in caseload: -7.1% fat, +4.2 lb lean.',
      '96% adherence trending up. HRV climbing 54→58 ms.',
      'All wearables green. No recovery flags.',
    ],
    notes: 'Discuss: maintenance vs continued cut. Ask about subjective energy — numbers are great, want narrative match.',
  },
  {
    id: 'b1',
    time: '11:00',
    end: '11:30',
    member: 'Buffer · Notes',
    init: '·',
    type: 'WRITE-UP BLOCK',
    duration: '30m',
    status: 'block',
  },
  {
    id: 's4',
    time: '11:30',
    end: '12:00',
    member: 'Marcus T.',
    init: 'MT',
    type: 'INTAKE · NEW MEMBER · DEXA #1',
    duration: '30m',
    status: 'upcoming',
    protocol: 'New member onboarding · Kalos Standard v0.9',
    flags: ['new-member'],
    brief: [
      'First DEXA today — body composition baseline.',
      'Tech founder · 38 · sedentary 5 years · high stress · single, no kids.',
      'Goals: lose 15 lb, rebuild cardiorespiratory base, sleep > 7h consistently.',
      'No wearable yet — Whoop issued at session end. Lingo activation tomorrow.',
      'Insurance: cash-pay membership. Health record uploaded last Friday.',
      'Onboarding step 02/07 begins today. Next: pair wearables (3 days).',
    ],
    notes: 'Set expectation up front: first 30 days = adherence-only. Do not chase numbers. Calibrate. Frame the scan reading around relative trajectory, not absolute values. Confirm Lingo placement at session end.',
  },
  {
    id: 'b2',
    time: '12:00',
    end: '13:00',
    member: 'Lunch',
    init: '·',
    type: 'LUNCH · RESEARCH READ',
    duration: '1h',
    status: 'block',
  },
  {
    id: 's5',
    time: '13:00',
    end: '13:30',
    member: 'Lena O.',
    init: 'L',
    type: 'CHECK-IN · WEEK 6',
    duration: '30m',
    status: 'upcoming',
    protocol: 'Aesthetic recomp · Kalos Standard v2.0',
    brief: [
      'Week 6 of 4-week extended to 8. Plateau at -3.4% fat.',
      'Adherence 84%. Sleep clean. HRV stable.',
      'Triangle: aesthetics 68, longevity 60, performance 55.',
    ],
  },
  {
    id: 's6',
    time: '14:00',
    end: '14:30',
    member: 'Aaron M.',
    init: 'A',
    type: 'POST-SCAN REVIEW',
    duration: '30m',
    status: 'upcoming',
    protocol: 'Visceral-fat reduction · Kalos Standard v2.3',
    brief: [
      'Scan #4 today. Visceral 1.62 → 1.31 lb (-19%).',
      'ALMI improving. Bone density stable.',
      'Six-month trajectory beats cohort median by 1.4σ.',
    ],
  },
  {
    id: 's7',
    time: '15:00',
    end: '15:30',
    member: 'Cohort review',
    init: '·',
    type: 'TEAM SYNC · 8 MEMBERS',
    duration: '30m',
    status: 'upcoming',
    brief: ['Weekly cohort-level review with the founders.', 'Bring Maya + Marcus context.'],
  },
];

export const PROTOCOLS = [
  {
    code: 'KS-2.3',
    title: 'Visceral-fat reduction',
    body: 'Hierarchical: 1) protein floor 1g/lb LBM · 2) post-meal walks 15m · 3) sleep ≥7h · 4) Zone-2 3×/wk · 5) deficit ≤500 kcal/d.',
    matches: 18,
    citations: 'Stanford CV-Health · 2024',
  },
  {
    code: 'KS-1.8',
    title: 'Hypertrophy plateau-break',
    body: 'Single-variable test sequence: 1) protein +30g/d · 2) creatine 5g/d · 3) volume +20% · 4) deload @ wk 6.',
    matches: 24,
    citations: 'Schoenfeld 2019 · UCSD Strength',
  },
  {
    code: 'KS-3.1',
    title: 'Longevity recomp',
    body: 'Targets ALMI > age-50th-pctile + visceral < 0.5 lb. Stress markers via HRV + RHR. De-emphasize scale.',
    matches: 11,
    citations: 'Attia 2023 · Stanford Healthspan',
  },
  {
    code: 'KS-2.0',
    title: 'Aesthetic recomp',
    body: 'Body-fat-first protocol. Symmetry awareness. Avoid below 18% F / 12% M without medical sign-off.',
    matches: 9,
    citations: 'NSCA position 2024',
  },
  {
    code: 'KS-0.9',
    title: 'New member onboarding',
    body: 'First 30 days: adherence + sleep only. Do not optimize. Single weekly check-in. Triangle baseline post scan #2.',
    matches: 14,
    citations: 'Kalos internal',
  },
];

export const DAY_BRIEF = {
  greet: 'Good morning, analyst.',
  sessions: 6,
  flagged: 1,
  drafted: 3,
  cohort: 'Visceral cohort (18) trending +0.4σ this week.',
  weather: '63°F · clear · SF studio',
};
