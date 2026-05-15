export interface ScanPoint { label: string; fat: number; lean: number; }
export interface AdherencePoint { label: string; val: number; color: string; }
export interface Client {
  id: string; name: string; init: string; status: 'on-track' | 'plateau' | 'flagged' | 'new';
  goals: string[]; analyst: string;
  triangle: [number, number, number]; triProj: [number, number, number];
  scans: ScanPoint[];
  met: { fat: string; fatD: string; lean: string; leanD: string; visc: string; viscD: string };
  adh: AdherencePoint[];
  wear: { hrv: string; sleep: string; recov: string; glu: string };
  next: string; sug: { change: string; reason: string; conf: string };
  flag: string | null;
  brief: { when: string; rows: string[]; pts: string[] };
}
export interface FoodFlag { ingredient: string; detail: string; level: 'warn' | 'ok'; }