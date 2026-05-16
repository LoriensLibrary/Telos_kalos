import { CLIENTS } from '../../data/clients';

export const m = CLIENTS[0];

export const FLAGS = [
  { ingredient: 'Sodium', detail: '1,150mg — 51% of daily target', level: 'warn' as const },
  { ingredient: 'Added Sugar', detail: '6g — within budget', level: 'ok' as const },
  { ingredient: 'Protein', detail: '18g — toward 110g target', level: 'ok' as const },
  { ingredient: 'Saturated Fat', detail: '8g — 40% of daily limit', level: 'warn' as const },
];

export const ringColors = ['var(--ac)', 'var(--cy)', 'var(--purple)', 'var(--warn)'];
export const ringTrack = 'rgba(255,255,255,0.08)';
