export interface MemberSession {
  id: string;
  date: string;
  time: string;
  title: string;
  detail: string;
  type: 'scan' | 'coach' | 'recovery' | 'class' | 'intake';
  duration: string;
  location: string;
  prepUrl?: string;
}

export const MEMBER_SCHEDULE: MemberSession[] = [
  {
    id: 'm1',
    date: 'TUE · MAY 12',
    time: '09:00',
    title: 'Coach check-in · James Wei',
    detail: 'Async video review · adherence + recovery signals · plan refresh',
    type: 'coach',
    duration: '20m',
    location: 'Telos app',
    prepUrl: '#prep',
  },
  {
    id: 'm2',
    date: 'WED · MAY 13',
    time: '11:30',
    title: 'DEXA #7 scan + analyst review',
    detail: '6-min scan · 20-min in-person results review · 4-week plan update',
    type: 'scan',
    duration: '45m',
    location: 'SF studio · 98a Battery St',
    prepUrl: '#prep',
  },
  {
    id: 'm3',
    date: 'WED · MAY 13',
    time: '17:30',
    title: 'Training · Upper B (self-led)',
    detail: 'Bench 4×6 · incline DB · cable row · tricep · face pull',
    type: 'class',
    duration: '45m',
    location: 'Your gym',
  },
  {
    id: 'm4',
    date: 'FRI · MAY 15',
    time: '07:00',
    title: 'Zone-2 (self-led)',
    detail: 'Z2 HR target 128 · 40m steady',
    type: 'class',
    duration: '40m',
    location: 'Anywhere',
  },
  {
    id: 'm5',
    date: 'SAT · MAY 16',
    time: '09:00',
    title: 'Training · Lower B (self-led)',
    detail: 'RDL · split squat · hip thrust · calf · core',
    type: 'class',
    duration: '50m',
    location: 'Your gym',
  },
  {
    id: 'm6',
    date: 'TUE · MAY 19',
    time: '09:00',
    title: 'Coach session · James Wei',
    detail: 'Scan #7 follow-up · cycle 7 program design',
    type: 'coach',
    duration: '20m',
    location: 'Telos app',
  },
];

export interface ConnectedApp {
  name: string;
  status: 'live' | 'paused' | 'available';
  category: string;
  metrics: string[];
  lastSync: string;
  desc: string;
}

export const CONNECTED_APPS: ConnectedApp[] = [
  {
    name: 'Kalos Photo Food Log',
    status: 'live',
    category: 'Nutrition',
    metrics: ['Protein target', 'Photo accountability', 'Macro estimates'],
    lastSync: 'just now',
    desc: 'Snap-a-photo meal log built into Telos. AI estimates protein + macros.',
  },
  {
    name: 'Kalos Weight Log',
    status: 'live',
    category: 'Body comp',
    metrics: ['Daily weight', 'Trend', 'DEXA delta'],
    lastSync: '6h ago',
    desc: 'Home weigh-ins between scans. Trend-only — Telos ignores daily noise.',
  },
  {
    name: 'Apple Health',
    status: 'available',
    category: 'Aggregator',
    metrics: ['Steps', 'Heart rate', 'Workouts', 'VO2 max'],
    lastSync: 'roadmap · Q2',
    desc: 'iPhone health hub — pulls from Apple Watch + third-party apps. Coming this quarter.',
  },
  {
    name: 'Whoop 4.0',
    status: 'available',
    category: 'Wearable',
    metrics: ['HRV', 'Sleep stages', 'Recovery score', 'Strain'],
    lastSync: 'roadmap · Q2',
    desc: 'Continuous physiology stream. Highest-priority wearable for the Telos roadmap.',
  },
  {
    name: 'Oura Ring',
    status: 'available',
    category: 'Wearable',
    metrics: ['Sleep score', 'Readiness', 'Activity', 'Skin temp'],
    lastSync: 'roadmap · Q3',
    desc: 'Ring-based 24/7 readiness + sleep tracker.',
  },
  {
    name: 'Abbott Lingo CGM',
    status: 'available',
    category: 'Glucose',
    metrics: ['Glucose mg/dL (5-min)', 'Time-in-range', 'Spikes'],
    lastSync: 'roadmap · Q3',
    desc: 'Continuous glucose monitor on upper arm. 14-day cycle.',
  },
  {
    name: 'Garmin',
    status: 'available',
    category: 'Wearable',
    metrics: ['GPS pace', 'Power', 'Cadence', 'VO2 max'],
    lastSync: 'roadmap · Q4',
    desc: 'For outdoor zone-2 + race training members.',
  },
  {
    name: 'Withings Body+',
    status: 'available',
    category: 'Scale',
    metrics: ['Weight', 'Body fat est.', 'BIA muscle est.'],
    lastSync: 'roadmap · Q4',
    desc: 'Smart scale for daily home weigh-ins between DEXA scans.',
  },
  {
    name: 'Strava',
    status: 'available',
    category: 'Activity',
    metrics: ['Routes', 'Segments', 'Power'],
    lastSync: 'roadmap · backlog',
    desc: 'Outdoor activity hub for runners and cyclists.',
  },
];

export interface OnboardingStep {
  num: string;
  title: string;
  detail: string;
  duration: string;
  status: 'done' | 'now' | 'next' | 'queued';
}

export const ONBOARDING_FLOW: OnboardingStep[] = [
  {
    num: '01',
    title: 'Welcome call',
    detail: 'A coach calls to set expectations, learn your goals, and book your first DEXA.',
    duration: '20 min',
    status: 'done',
  },
  {
    num: '02',
    title: 'First DEXA scan',
    detail: 'Body composition baseline. 6-min scan + 30-min results review with your coach.',
    duration: '45 min',
    status: 'done',
  },
  {
    num: '03',
    title: 'Pair wearables',
    detail: 'Whoop or Oura issued at scan end. Apple Health & MyFitnessPal connected.',
    duration: '15 min',
    status: 'now',
  },
  {
    num: '04',
    title: 'Lingo CGM activation',
    detail: 'Apply CGM on upper arm. 1h warm-up then continuous glucose data starts flowing.',
    duration: '1 hr',
    status: 'next',
  },
  {
    num: '05',
    title: 'First program week',
    detail: 'Two lifts, two zone-2 sessions, nutrition targets. Telos checks in daily.',
    duration: '7 days',
    status: 'queued',
  },
  {
    num: '06',
    title: 'Week-1 check-in',
    detail: 'Coach reviews wearable + adherence data, fine-tunes the program for week 2-4.',
    duration: '30 min',
    status: 'queued',
  },
  {
    num: '07',
    title: 'DEXA #2 & Triangle baseline',
    detail: 'Second scan establishes your trajectory. Triangle (Aesthetics / Longevity / Performance) gets its first projection.',
    duration: '45 min',
    status: 'queued',
  },
];
