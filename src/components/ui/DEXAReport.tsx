import { useState } from 'react';
import DEXAChart from '../charts/DEXAChart';
import DEXABody from '../charts/DEXABody';
import { CLIENTS } from '../../data/clients';

const m = CLIENTS[0];

// Full per-scan data — what changes scan-to-scan
interface ScanData {
  num: number;
  date: string;
  reportId: string;
  bodyFat: string;
  bodyFatNum: number;
  leanMass: string;
  leanMassNum: number;
  visceral: string;
  visceralNum: number;
  almi: string;
  bmd: string;
  tScore: string;
  zScore: string;
  symmetry: string;
  segments: { head: string; lArm: string; rArm: string; trunk: string; lLeg: string; rLeg: string };
  note: string;
}

const SCANS: ScanData[] = [
  {
    num: 1, date: 'NOV 5, 2025', reportId: 'KAL-DXA-25-1105-MR',
    bodyFat: '32.1%', bodyFatNum: 32.1, leanMass: '104.2 lb', leanMassNum: 104.2,
    visceral: '1.45 lb', visceralNum: 1.45, almi: '7.51', bmd: '1.10 g/cm²',
    tScore: '+0.4', zScore: '+0.6', symmetry: '95.8%',
    segments: { head: '3.6', lArm: '6.0', rArm: '6.2', trunk: '46.4', lLeg: '23.0', rLeg: '22.4' },
    note: 'Baseline. Starting point — no comparison yet.',
  },
  {
    num: 2, date: 'DEC 3, 2025', reportId: 'KAL-DXA-25-1203-MR',
    bodyFat: '31.2%', bodyFatNum: 31.2, leanMass: '105.1 lb', leanMassNum: 105.1,
    visceral: '1.38 lb', visceralNum: 1.38, almi: '7.58', bmd: '1.10 g/cm²',
    tScore: '+0.4', zScore: '+0.6', symmetry: '96.1%',
    segments: { head: '3.6', lArm: '6.1', rArm: '6.2', trunk: '46.8', lLeg: '23.2', rLeg: '22.6' },
    note: 'First delta. Fat down 0.9%, lean up 0.9 lb. Trend forming.',
  },
  {
    num: 3, date: 'JAN 7, 2026', reportId: 'KAL-DXA-26-0107-MR',
    bodyFat: '30.5%', bodyFatNum: 30.5, leanMass: '106.0 lb', leanMassNum: 106.0,
    visceral: '1.31 lb', visceralNum: 1.31, almi: '7.64', bmd: '1.11 g/cm²',
    tScore: '+0.5', zScore: '+0.7', symmetry: '96.4%',
    segments: { head: '3.7', lArm: '6.2', rArm: '6.3', trunk: '47.2', lLeg: '23.4', rLeg: '22.8' },
    note: 'Trajectory confirmed. Both directions are real.',
  },
  {
    num: 4, date: 'FEB 4, 2026', reportId: 'KAL-DXA-26-0204-MR',
    bodyFat: '30.0%', bodyFatNum: 30.0, leanMass: '106.8 lb', leanMassNum: 106.8,
    visceral: '1.25 lb', visceralNum: 1.25, almi: '7.70', bmd: '1.11 g/cm²',
    tScore: '+0.5', zScore: '+0.7', symmetry: '96.6%',
    segments: { head: '3.7', lArm: '6.3', rArm: '6.4', trunk: '47.6', lLeg: '23.5', rLeg: '22.9' },
    note: 'Slight deceleration. Plan tweak: post-meal walks added.',
  },
  {
    num: 5, date: 'MAR 4, 2026', reportId: 'KAL-DXA-26-0304-MR',
    bodyFat: '29.6%', bodyFatNum: 29.6, leanMass: '107.4 lb', leanMassNum: 107.4,
    visceral: '1.20 lb', visceralNum: 1.20, almi: '7.78', bmd: '1.12 g/cm²',
    tScore: '+0.6', zScore: '+0.8', symmetry: '96.8%',
    segments: { head: '3.8', lArm: '6.3', rArm: '6.5', trunk: '47.9', lLeg: '23.7', rLeg: '23.0' },
    note: 'Walks worked. Visceral now below 1.25 lb for first time.',
  },
  {
    num: 6, date: 'APR 1, 2026', reportId: 'KAL-DXA-26-0401-MR',
    bodyFat: '28.4%', bodyFatNum: 28.4, leanMass: '108.2 lb', leanMassNum: 108.2,
    visceral: '1.14 lb', visceralNum: 1.14, almi: '7.84', bmd: '1.12 g/cm²',
    tScore: '+0.6', zScore: '+0.8', symmetry: '96.9%',
    segments: { head: '3.8', lArm: '6.4', rArm: '6.6', trunk: '48.2', lLeg: '23.8', rLeg: '23.2' },
    note: 'Best scan yet. 0.14 lb to visceral goal. Trajectory protects scan #7.',
  },
];

const COLORS = { good: 'var(--ac)', flat: 'var(--ink-m)', warn: 'var(--warn)' };

interface Row {
  label: string;
  range: string;
  trend: 'good' | 'flat' | 'warn';
  getValue: (s: ScanData) => string;
  getNote: (s: ScanData, prev?: ScanData) => string;
}

const ROWS: Row[] = [
  {
    label: 'Total body fat %', range: '21–33% target', trend: 'good',
    getValue: (s) => s.bodyFat,
    getNote: (s, prev) => prev ? `${(s.bodyFatNum - prev.bodyFatNum).toFixed(1)}% vs prior scan.` : 'Baseline scan.',
  },
  {
    label: 'Lean mass', range: '+3 lb Q3 goal', trend: 'good',
    getValue: (s) => s.leanMass,
    getNote: (s, prev) => prev ? `${(s.leanMassNum - prev.leanMassNum > 0 ? '+' : '')}${(s.leanMassNum - prev.leanMassNum).toFixed(1)} lb vs prior scan.` : 'Baseline scan.',
  },
  {
    label: 'Visceral fat', range: '< 1.0 lb target', trend: 'good',
    getValue: (s) => s.visceral,
    getNote: (s, prev) => prev ? `${(s.visceralNum - prev.visceralNum).toFixed(2)} lb vs prior. ${(s.visceralNum - 1.0).toFixed(2)} lb to goal.` : 'Baseline visceral.',
  },
  {
    label: 'ALMI (appendicular lean / m²)', range: '> 6.0 healthy', trend: 'flat',
    getValue: (s) => s.almi,
    getNote: () => 'Age-cohort percentile climbing.',
  },
  {
    label: 'BMD (bone mineral density)', range: 'T-score target', trend: 'good',
    getValue: (s) => s.bmd,
    getNote: (s) => `T-score ${s.tScore} · Z-score ${s.zScore}.`,
  },
  {
    label: 'Symmetry (L/R lean)', range: '> 95% target', trend: 'good',
    getValue: (s) => s.symmetry,
    getNote: () => 'Within tolerance — no imbalance to correct.',
  },
];

export default function DEXAReport() {
  const [scanIdx, setScanIdx] = useState(SCANS.length - 1); // default to latest
  const s = SCANS[scanIdx];
  const prev = scanIdx > 0 ? SCANS[scanIdx - 1] : undefined;
  const baseline = SCANS[0];

  // deltas vs baseline
  const fatDelta = (s.bodyFatNum - baseline.bodyFatNum).toFixed(1);
  const leanDelta = (s.leanMassNum - baseline.leanMassNum).toFixed(1);
  const visceralDelta = (s.visceralNum - baseline.visceralNum).toFixed(2);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 space-y-6">
        {/* SCAN PICKER */}
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="lbl mb-1" style={{ color: 'var(--ac-b)' }}>SCAN HISTORY</div>
              <div className="serif text-xl" style={{ fontWeight: 400 }}>
                Click any scan to view that report
              </div>
            </div>
            <span className="chip chip-ac">{SCANS.length} SCANS · 5 MONTHS</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {SCANS.map((scan, i) => {
              const active = i === scanIdx;
              return (
                <button
                  key={scan.num}
                  onClick={() => setScanIdx(i)}
                  className="text-left p-3 rounded-xl transition-all flex-1"
                  style={{
                    background: active
                      ? 'color-mix(in srgb, var(--ac) 12%, transparent)'
                      : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${active ? 'color-mix(in srgb, var(--ac) 36%, transparent)' : 'var(--line)'}`,
                    boxShadow: active ? 'inset 0 0 0 1px color-mix(in srgb, var(--ac) 22%, transparent)' : 'none',
                    cursor: 'pointer',
                    minWidth: 96,
                  }}
                >
                  <div className="lbl" style={{ fontSize: 9, color: active ? 'var(--ac-b)' : 'var(--ink-m)' }}>
                    SCAN #{scan.num}
                  </div>
                  <div
                    className="mono num text-sm mt-1"
                    style={{ fontWeight: 500, color: active ? 'var(--ink)' : 'var(--ink-s)' }}
                  >
                    {scan.bodyFat}
                  </div>
                  <div className="lbl mt-0.5" style={{ fontSize: 8 }}>
                    {scan.date.split(',')[0].toUpperCase()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PDF-style cover */}
        <div className="glass p-0 overflow-hidden">
          <div
            className="p-10"
            style={{
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--ac) 8%, transparent) 0%, transparent 100%)',
              borderBottom: '1px solid var(--line-s)',
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="lbl mb-2" style={{ color: 'var(--ac-b)' }}>
                  DEXA REPORT · SCAN #{s.num}
                </div>
                <h2 className="serif text-3xl mb-1" style={{ fontWeight: 400 }}>
                  Maya Reyes
                </h2>
                <div className="lbl">{s.date} · SF STUDIO · ANALYST: JAMES WEI</div>
              </div>
              <div className="text-right">
                <div className="lbl mb-2">REPORT</div>
                <div className="mono num text-sm">{s.reportId}</div>
                <button className="btn-gh mt-3" style={{ padding: '6px 12px', fontSize: 10 }}>
                  Download PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: '1px dashed var(--line-s)' }}>
              {[
                { l: 'BODY FAT', v: s.bodyFat, d: scanIdx === 0 ? 'baseline' : `${(s.bodyFatNum - baseline.bodyFatNum >= 0 ? '+' : '')}${fatDelta}% from baseline` },
                { l: 'LEAN MASS', v: s.leanMass, d: scanIdx === 0 ? 'baseline' : `${(s.leanMassNum - baseline.leanMassNum >= 0 ? '+' : '')}${leanDelta} lb from baseline` },
                { l: 'VISCERAL', v: s.visceral, d: scanIdx === 0 ? 'baseline' : `${visceralDelta} lb from baseline` },
              ].map((x) => (
                <div key={x.l}>
                  <div className="lbl mb-1">{x.l}</div>
                  <div className="mono num text-2xl" style={{ fontWeight: 300 }}>{x.v}</div>
                  <div className="text-[10px] mono" style={{ color: 'var(--ac)' }}>{x.d}</div>
                </div>
              ))}
            </div>

            {scanIdx > 0 && (
              <div
                className="mt-5 p-4 rounded-lg"
                style={{
                  background: 'color-mix(in srgb, var(--cy) 6%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--cy) 22%, transparent)',
                }}
              >
                <div className="lbl mb-1" style={{ color: 'var(--cy)' }}>ANALYST NOTE</div>
                <div className="text-sm">{s.note}</div>
              </div>
            )}
          </div>

          {/* BODY SCAN IMAGE — the visual hero */}
          <div className="grid grid-cols-12 gap-6 p-10">
            <div className="col-span-7">
              <div className="flex items-center justify-between mb-3">
                <div className="lbl" style={{ color: 'var(--ac-b)' }}>SCAN IMAGE · ANTERIOR · #{s.num}</div>
                <span className="chip chip-ac">SEGMENTED</span>
              </div>
              <div
                className="rounded-xl p-4"
                style={{
                  background:
                    'radial-gradient(ellipse at center, color-mix(in srgb, var(--cy) 8%, transparent), rgba(4,4,10,0.6))',
                  border: '1px solid var(--line)',
                }}
              >
                <DEXABody size={420} segments={s.segments} visceral={s.visceralNum} />
              </div>
              <div className="lbl mt-3" style={{ fontSize: 9 }}>
                SEGMENTAL LEAN: HEAD {s.segments.head} · L ARM {s.segments.lArm} · R ARM {s.segments.rArm} · TRUNK {s.segments.trunk} · L LEG {s.segments.lLeg} · R LEG {s.segments.rLeg} (LB)
              </div>
            </div>
            <div className="col-span-5">
              <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>READ THIS IN 10 SECONDS</div>
              <div className="space-y-3">
                {[
                  { label: 'WHERE THE LEAN IS', val: 'Trunk + legs leading', tone: 'var(--ac)' },
                  { label: 'WHERE THE FAT IS', val: 'Visceral pocket — shrinking', tone: 'var(--warn)' },
                  { label: 'SYMMETRY', val: `${s.symmetry} — no imbalance`, tone: 'var(--ac)' },
                  { label: 'BONE', val: `T-score ${s.tScore} · above median`, tone: 'var(--ac)' },
                ].map((x) => (
                  <div
                    key={x.label}
                    className="p-3 rounded-lg flex items-center gap-3"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}
                  >
                    <span className="dot" style={{ background: x.tone, boxShadow: `0 0 8px ${x.tone}` }} />
                    <div className="flex-1">
                      <div className="lbl" style={{ fontSize: 9 }}>{x.label}</div>
                      <div className="text-sm" style={{ fontWeight: 500 }}>{x.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  { c: 'rgba(255,184,122,0.7)', l: 'FAT' },
                  { c: 'rgba(125,211,252,0.7)', l: 'LEAN' },
                  { c: 'rgba(245,247,250,0.8)', l: 'BONE' },
                ].map((k) => (
                  <div key={k.l}>
                    <div className="mx-auto" style={{ width: 18, height: 6, borderRadius: 3, background: k.c, boxShadow: `0 0 8px ${k.c}` }} />
                    <div className="lbl mt-1" style={{ fontSize: 8 }}>{k.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* trend chart with selected scan highlight */}
          <div className="p-10 pt-0">
            <div className="flex items-center justify-between mb-3">
              <div className="lbl" style={{ color: 'var(--ac-b)' }}>6-SCAN TREND · #{s.num} HIGHLIGHTED</div>
              <span className="chip chip-ac">TRAJECTORY ON TRACK</span>
            </div>
            <DEXAChart data={m.scans} />
          </div>
        </div>

        {/* Visual takeaways — short, scannable */}
        <div className="glass p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="lbl" style={{ color: 'var(--ac-b)' }}>FIVE THINGS TO KNOW · SCAN #{s.num}</div>
            <span className="chip">vs BASELINE</span>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {[
              { n: `${(Math.abs(parseFloat(fatDelta)) + Math.abs(parseFloat(leanDelta))).toFixed(1)} lb`, l: 'RECOMPOSED', s: 'fat off, lean on', c: 'var(--ac)' },
              { n: `${(s.visceralNum - 1.0).toFixed(2)} lb`, l: 'TO VISC GOAL', s: 'under 1.0 target', c: s.visceralNum > 1.0 ? 'var(--warn)' : 'var(--ac)' },
              { n: `+${leanDelta} lb`, l: 'LEAN GAINED', s: 'trunk + legs', c: 'var(--ac)' },
              { n: `${s.zScore}`, l: 'BONE Z-SCORE', s: 'top quintile', c: 'var(--cy)' },
              { n: s.almi, l: 'ALMI', s: 'climbing', c: 'var(--purple)' },
            ].map((x) => (
              <div
                key={x.l}
                className="p-4 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}
              >
                <div className="mono num text-xl mb-1" style={{ color: x.c, fontWeight: 500 }}>{x.n}</div>
                <div className="lbl mb-1" style={{ fontSize: 9 }}>{x.l}</div>
                <div className="text-[10px]" style={{ color: 'var(--ink-s)' }}>{x.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail table */}
        <div className="glass p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="lbl" style={{ color: 'var(--ac-b)' }}>FULL METRIC BREAKDOWN · SCAN #{s.num}</div>
            {prev && <span className="chip">vs SCAN #{prev.num}</span>}
          </div>
          <div className="space-y-3">
            {ROWS.map((r) => (
              <div
                key={r.label}
                className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}
              >
                <div className="col-span-4">
                  <div className="text-sm" style={{ fontWeight: 500 }}>{r.label}</div>
                  <div className="lbl mt-0.5" style={{ fontSize: 9 }}>{r.range}</div>
                </div>
                <div className="col-span-2 mono num text-lg" style={{ color: COLORS[r.trend] }}>
                  {r.getValue(s)}
                </div>
                <div className="col-span-5 text-xs" style={{ color: 'var(--ink-s)' }}>
                  {r.getNote(s, prev)}
                </div>
                <div className="col-span-1 text-right">
                  <span className="dot" style={{ background: COLORS[r.trend], boxShadow: `0 0 8px ${COLORS[r.trend]}` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-4 space-y-6">
        {/* PDF preview */}
        <div className="glass p-6">
          <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>PDF PREVIEW · #{s.num}</div>
          <div
            className="rounded-lg overflow-hidden"
            style={{
              background: '#F5F7FA',
              color: '#04040A',
              boxShadow: '0 16px 32px -8px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="p-5" style={{ background: '#FFFFFF', borderBottom: '2px solid #04040A' }}>
              <div
                style={{
                  fontFamily: 'Geist Mono, monospace',
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  color: '#04040A',
                  marginBottom: 6,
                }}
              >
                KALOS · DEXA REPORT
              </div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, lineHeight: 1.1, color: '#04040A' }}>
                Maya Reyes
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>
                Scan #{s.num} · {s.date} · {s.reportId}
              </div>
            </div>
            <div className="p-5 space-y-2" style={{ fontSize: 10 }}>
              {[
                { l: 'BODY FAT', v: s.bodyFat },
                { l: 'LEAN MASS', v: s.leanMass },
                { l: 'VISCERAL', v: s.visceral },
                { l: 'BMD', v: s.bmd },
                { l: 'T-SCORE', v: s.tScore },
                { l: 'ALMI', v: s.almi },
              ].map((x) => (
                <div
                  key={x.l}
                  className="flex justify-between"
                  style={{ borderBottom: '1px dashed #D1D5DB', paddingBottom: 4 }}
                >
                  <span style={{ fontFamily: 'Geist Mono, monospace', letterSpacing: '0.10em', color: '#6B7280' }}>
                    {x.l}
                  </span>
                  <span style={{ fontFamily: 'Geist Mono, monospace', fontWeight: 600, color: '#04040A' }}>{x.v}</span>
                </div>
              ))}
            </div>
            <div className="p-5" style={{ borderTop: '1px solid #E5E7EB', fontSize: 9, color: '#6B7280' }}>
              Pages 2–4: trend charts, segmented analysis, longevity panel, plan for next 4 weeks.
            </div>
          </div>
          <button className="btn-gh w-full mt-4">Open full PDF</button>
        </div>

        <div className="glass p-6 glow-cy">
          <div className="lbl mb-3" style={{ color: 'var(--cy)' }}>HOW DEXA WORKS</div>
          <p className="text-sm mb-3" style={{ color: 'var(--ink-s)' }}>
            Dual-energy X-ray absorptiometry sends two low-dose X-ray beams through your body. Tissues absorb the
            beams differently — bone most, fat least, lean tissue in between. The scanner reconstructs the result
            into three layers: <em className="serif italic">bone, fat, lean</em>.
          </p>
          <p className="text-sm mb-3" style={{ color: 'var(--ink-s)' }}>
            Radiation dose: ~0.001 mSv — roughly 1/1000th of an annual background dose. Safe to repeat every
            4–8 weeks, the Kalos cadence.
          </p>
          <div className="lbl mt-4 mb-2">SCAN SEQUENCE</div>
          <ol className="space-y-2 text-xs" style={{ color: 'var(--ink-s)' }}>
            <li><span className="mono" style={{ color: 'var(--cy)' }}>01</span> 6-min scan · lie still</li>
            <li><span className="mono" style={{ color: 'var(--cy)' }}>02</span> 20-min analyst review</li>
            <li><span className="mono" style={{ color: 'var(--cy)' }}>03</span> 10-min strategy session</li>
            <li><span className="mono" style={{ color: 'var(--cy)' }}>04</span> Plan updates in Telos that night</li>
          </ol>
        </div>

        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>NEXT SCAN</div>
          <div className="mono num text-3xl mb-1">21d</div>
          <div className="text-sm mb-4" style={{ color: 'var(--ink-s)' }}>May 13 · DEXA #7 · 11:30 AM · SF studio</div>
          <button className="btn-ac w-full">Reschedule</button>
        </div>
      </div>
    </div>
  );
}
