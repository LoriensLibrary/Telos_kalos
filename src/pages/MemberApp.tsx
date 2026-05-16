// TODO(refactor): extract per-tab components into src/pages/member/*Tab.tsx
// The 6 nested tab components (Today, Body, Nutrition, Movement, Sleep, Telos)
// each close over the module-level `m` const and the tab-bar constants, so the
// extraction is mostly mechanical: move each component into its own file,
// import `m`/`FLAGS`/`ringColors`/`ringTrack` from a shared module (or pass as
// props), and replace the inline `<Today />` calls below with module imports.
import { useState } from 'react';
import { CLIENTS } from '../data/clients';
import { MAYA_CHAT } from '../data/chat';
import {
  TODAY_RINGS,
  HYDRATION,
  FOOD_LOG,
  WORKOUTS_WEEK,
  TODAY_WORKOUT,
  SLEEP_NIGHTS,
  GLUCOSE_TRACE,
  GLUCOSE_STATS,
  SUPPLEMENTS,
  GOALS,
  PROGRAMS,
} from '../data/day';
import DEXAChart from '../components/charts/DEXAChart';
import TriangleChart from '../components/charts/TriangleChart';
import Ring from '../components/charts/Ring';
import Sparkline from '../components/charts/Sparkline';
import Chat from '../components/ui/Chat';
import Tabs from '../components/ui/Tabs';
import Feedback from '../components/ui/Feedback';
import Schedule from '../components/ui/Schedule';
import Apps from '../components/ui/Apps';
import DEXAReport from '../components/ui/DEXAReport';
import Onboarding from '../components/ui/Onboarding';
import AnalystMatch from '../components/ui/AnalystMatch';

const m = CLIENTS[0];

const FLAGS = [
  { ingredient: 'Sodium', detail: '1,150mg — 51% of daily target', level: 'warn' as const },
  { ingredient: 'Added Sugar', detail: '6g — within budget', level: 'ok' as const },
  { ingredient: 'Protein', detail: '18g — toward 110g target', level: 'ok' as const },
  { ingredient: 'Saturated Fat', detail: '8g — 40% of daily limit', level: 'warn' as const },
];

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'body', label: 'Body' },
  { id: 'dexa', label: 'DEXA Report' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'movement', label: 'Movement' },
  { id: 'sleep', label: 'Sleep · Recovery' },
  { id: 'telos', label: 'Telos', badge: 3 },
  { id: 'apps', label: 'Apps' },
  { id: 'match', label: 'Find Your Analyst' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'feedback', label: 'Suggestions' },
];

const ringColors = ['var(--ac)', 'var(--cy)', 'var(--purple)', 'var(--warn)'];
const ringTrack = 'rgba(255,255,255,0.08)';

export default function MemberApp() {
  const [tab, setTab] = useState('today');

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-14">
      {/* HEAD */}
      <div className="mb-8 flex items-end justify-between flex-wrap gap-6">
        <div>
          <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>
            MEMBER APP · MAYA REYES · MAY 13 · 07:42
          </div>
          <h1
            className="brk"
            style={{
              fontSize: 'clamp(2.6rem,5vw,3.8rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
              fontWeight: 300,
              padding: '8px 0',
            }}
          >
            Good morning,{' '}
            <em className="serif italic holo" style={{ fontWeight: 400 }}>
              Maya
            </em>
            .
          </h1>
          <p className="mt-3 text-base max-w-xl" style={{ color: 'var(--ink-s)' }}>
            8 days since DEXA #6 · 21 days until DEXA #7. Telos is keeping watch.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip chip-ac">
            <span className="dot dot-ac pulse" /> KALOS FOOD LOG
          </span>
          <span className="chip chip-ac">WEIGHT LOG</span>
          <span className="chip chip-cy">WHOOP · ROADMAP Q2</span>
          <span className="chip">APPLE HEALTH · ROADMAP Q2</span>
        </div>
      </div>

      <div className="mb-8">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'today' && <Today />}
      {tab === 'schedule' && <Schedule />}
      {tab === 'body' && <Body />}
      {tab === 'dexa' && <DEXAReport />}
      {tab === 'nutrition' && <Nutrition />}
      {tab === 'movement' && <Movement />}
      {tab === 'sleep' && <Sleep />}
      {tab === 'telos' && <Telos />}
      {tab === 'apps' && <Apps />}
      {tab === 'match' && <AnalystMatch />}
      {tab === 'onboarding' && <Onboarding />}
      {tab === 'feedback' && <Feedback audience="member" />}
    </div>
  );

  /* ============================ TABS ============================ */

  function Today() {
    return (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          {/* RINGS */}
          <div className="glass p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="lbl" style={{ color: 'var(--ac-b)' }}>TODAY · ACTIVITY RINGS</div>
              <span className="chip chip-ac">68% TO TARGET</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {TODAY_RINGS.map((r, i) => (
                <div key={r.label} className="flex items-center gap-4">
                  <Ring pct={r.pct} size={84} color={ringColors[i]} track={ringTrack} label={r.v.split(' ')[0]} />
                  <div>
                    <div className="lbl">{r.label}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--ink-s)' }}>{r.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TODAY'S WORKOUT */}
          <div className="glass p-7 glow">
            <div className="flex items-center justify-between mb-3">
              <div className="lbl" style={{ color: 'var(--ac-b)' }}>SCHEDULED · {TODAY_WORKOUT.time}</div>
              <span className="chip chip-ac">
                <span className="dot dot-ac pulse" /> {TODAY_WORKOUT.status.toUpperCase()}
              </span>
            </div>
            <div className="serif text-2xl mb-2" style={{ fontWeight: 400 }}>{TODAY_WORKOUT.title}</div>
            <div className="text-sm mb-4" style={{ color: 'var(--ink-s)' }}>{TODAY_WORKOUT.detail}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <button className="btn-ac">Start workout</button>
              <button className="btn-gh">Swap exercise</button>
              <button className="btn-gh">Ask Telos</button>
            </div>
          </div>

          {/* GOALS */}
          <div className="glass p-7">
            <div className="lbl mb-5" style={{ color: 'var(--ac-b)' }}>GOAL PROGRESS</div>
            <div className="space-y-4">
              {GOALS.map((g, i) => {
                const min = Math.min(g.start, g.target);
                const max = Math.max(g.start, g.target);
                const pct = ((g.current - min) / (max - min)) * 100;
                const ok = g.dir === 'up' ? g.current >= g.target : g.current <= g.target;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm" style={{ fontWeight: 500 }}>{g.name}</div>
                      <div className="mono num text-xs" style={{ color: ok ? 'var(--ac)' : 'var(--ink-s)' }}>
                        {g.current}{g.unit} → {g.target}{g.unit}
                      </div>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(100, Math.max(2, pct))}%`,
                          background: ok
                            ? `linear-gradient(90deg, var(--ac), var(--ac-b))`
                            : `linear-gradient(90deg, var(--cy), var(--cy-b))`,
                          boxShadow: `0 0 12px ${ok ? 'var(--ac)' : 'var(--cy)'}`,
                          transition: 'width 600ms ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Daily check-ins / hydration / sup */}
        <div className="col-span-4 space-y-6">
          <div className="glass p-6">
            <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>HYDRATION</div>
            <div className="flex items-center justify-between mb-3">
              <div className="mono num text-3xl">{HYDRATION.current}<span className="text-base" style={{ color: 'var(--ink-m)' }}>/{HYDRATION.target}L</span></div>
              <span className="chip">62%</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${(HYDRATION.current/HYDRATION.target)*100}%`, height: '100%', background: 'linear-gradient(90deg, var(--cy), var(--cy-b))', boxShadow: '0 0 12px var(--cy)' }} />
            </div>
            <div className="flex items-center gap-2 mt-4">
              {[250, 500, 750].map(v => <button key={v} className="btn-gh" style={{ padding: '6px 10px', fontSize: 10 }}>+{v}ml</button>)}
            </div>
          </div>

          <div className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="lbl" style={{ color: 'var(--ac-b)' }}>SUPPLEMENT STACK</div>
              <span className="chip chip-ac">3 OF 4 TAKEN</span>
            </div>
            <div className="space-y-3">
              {SUPPLEMENTS.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <input type="checkbox" defaultChecked={i < 3} style={{ accentColor: 'var(--ac)', marginTop: 3 }} />
                  <div className="flex-1">
                    <div className="text-sm" style={{ fontWeight: 500 }}>{s.name}</div>
                    <div className="lbl mt-0.5" style={{ fontSize: 9 }}>{s.dose} · {s.when} · {s.adh}% adh</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6">
            <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>YOUR TRIANGLE</div>
            <TriangleChart scores={m.triangle} projected={m.triProj} size={190} />
          </div>

          <div className="glass p-6 glow-cy">
            <div className="lbl mb-3" style={{ color: 'var(--cy)' }}>WHAT'S LIVE TODAY</div>
            <div className="space-y-2 text-xs" style={{ color: 'var(--ink-s)' }}>
              {[
                { v: 'Next DEXA scan', t: 'Reserved · May 13 · 11:30' },
                { v: 'Analyst check-in', t: 'Analyst 2 · 09:00' },
                { v: 'Active program', t: 'Min-effective · wk 2 of 4' },
                { v: 'App + analyst access', t: '24/7' },
              ].map((a, i) => (
                <div key={i} className="flex justify-between gap-3 pb-2" style={{ borderBottom: i < 3 ? '1px dashed var(--line)' : 'none' }}>
                  <span style={{ color: 'var(--ink)' }}>{a.v}</span>
                  <span className="mono" style={{ fontSize: 11 }}>{a.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Body() {
    return (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <div className="glass p-7">
            <div className="flex items-center justify-between mb-2">
              <div className="lbl" style={{ color: 'var(--ac-b)' }}>DEXA BODY COMPOSITION · 6 SCANS</div>
              <span className="chip chip-ac">TRENDING</span>
            </div>
            <div className="serif text-xl mb-4" style={{ fontWeight: 400 }}>Your body, measured over time</div>
            <DEXAChart data={m.scans} />
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4" style={{ borderTop: '1px dashed var(--line-s)' }}>
              {[
                { l: 'BODY FAT', v: m.met.fat, d: m.met.fatD },
                { l: 'LEAN MASS', v: m.met.lean, d: m.met.leanD },
                { l: 'VISCERAL', v: m.met.visc, d: m.met.viscD },
              ].map((x, i) => (
                <div key={i}>
                  <div className="lbl mb-1">{x.l}</div>
                  <div className="mono text-2xl num" style={{ fontWeight: 300 }}>{x.v}</div>
                  <div className="text-[10px] mono" style={{ color: 'var(--ac)' }}>{x.d} total</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass p-6">
              <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>SEGMENTED LEAN MASS · SCAN #6</div>
              <div className="space-y-3">
                {[
                  { l: 'Left arm', v: 6.4, max: 8 },
                  { l: 'Right arm', v: 6.6, max: 8 },
                  { l: 'Trunk', v: 48.2, max: 56 },
                  { l: 'Left leg', v: 23.8, max: 28 },
                  { l: 'Right leg', v: 23.2, max: 28 },
                ].map((b, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--ink-s)' }}>{b.l}</span>
                      <span className="mono num" style={{ color: 'var(--ink)' }}>{b.v} lb</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
                      <div style={{ height: '100%', width: `${(b.v/b.max)*100}%`, background: 'linear-gradient(90deg, var(--ac), var(--ac-b))', borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="lbl mt-4" style={{ fontSize: 9 }}>SYMMETRY: 96.9% · WITHIN TOLERANCE</div>
            </div>

            <div className="glass p-6">
              <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>BONE & SKELETAL</div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { l: 'BMD', v: '1.12 g/cm²', d: '+0.4% YoY' },
                  { l: 'BMC', v: '2.41 kg', d: 'stable' },
                  { l: 'T-SCORE', v: '+0.6', d: 'above avg' },
                  { l: 'Z-SCORE', v: '+0.8', d: 'p82' },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
                    <div className="lbl mb-1">{s.l}</div>
                    <div className="mono num text-lg" style={{ fontWeight: 300 }}>{s.v}</div>
                    <div className="text-[10px] mono" style={{ color: 'var(--ac)' }}>{s.d}</div>
                  </div>
                ))}
              </div>
              <div className="lbl" style={{ fontSize: 9 }}>BONE HEALTH: ABOVE AGE-COHORT MEDIAN</div>
            </div>
          </div>

          <div className="glass p-7">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>WEIGHT LOG · 30 DAYS</div>
            <Sparkline
              values={[148.2, 147.8, 147.6, 147.4, 147.1, 146.8, 146.5, 146.7, 146.4, 146.2, 145.9, 145.7, 145.5, 145.3, 145.4, 145.1, 144.9, 144.7, 144.5, 144.4, 144.1, 143.9, 143.7, 143.6, 143.4, 143.2, 143.0, 142.8, 142.7, 142.5]}
              color="var(--cy)"
              height={100}
            />
            <div className="flex items-center justify-between mt-3 text-xs mono num" style={{ color: 'var(--ink-s)' }}>
              <span>148.2 lb · APR 13</span>
              <span style={{ color: 'var(--ac)' }}>-5.7 lb · 30d</span>
              <span>142.5 lb · TODAY</span>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>YOUR TRIANGLE</div>
            <TriangleChart scores={m.triangle} projected={m.triProj} size={200} />
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4" style={{ borderTop: '1px dashed var(--line-s)' }}>
              {[
                { l: 'AESTH', v: 62, p: 78 },
                { l: 'LONG', v: 48, p: 68 },
                { l: 'PERF', v: 55, p: 72 },
              ].map((t, i) => (
                <div key={i} className="text-center">
                  <div className="mono num text-base">{t.v}</div>
                  <div className="lbl" style={{ fontSize: 8 }}>{t.l}</div>
                  <div className="mono num text-[10px]" style={{ color: 'var(--ac)' }}>+{t.p - t.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>NEXT SCAN</div>
            <div className="mono num text-3xl mb-1">21d</div>
            <div className="text-sm mb-4" style={{ color: 'var(--ink-s)' }}>May 13 · DEXA #7 · 11:30 AM</div>
            <button className="btn-gh" style={{ width: '100%' }}>Reschedule</button>
          </div>

          <div className="glass p-6 glow-cy">
            <div className="lbl mb-3" style={{ color: 'var(--cy)' }}>COHORT POSITION</div>
            <div className="text-sm mb-4" style={{ color: 'var(--ink-s)' }}>vs 47 members with similar baseline</div>
            <div className="space-y-3">
              {[
                { l: 'Fat loss velocity', p: 78 },
                { l: 'Lean retention', p: 84 },
                { l: 'Adherence', p: 41 },
                { l: 'Sleep quality', p: 23 },
              ].map((x, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--ink-s)' }}>{x.l}</span>
                    <span className="mono num">p{x.p}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
                    <div style={{ height: '100%', width: `${x.p}%`, background: x.p > 50 ? 'linear-gradient(90deg, var(--ac), var(--ac-b))' : 'linear-gradient(90deg, var(--warn), #FFD9A0)', borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Nutrition() {
    const targets = { kcal: 1850, protein: 110, carbs: 200, fat: 65 };
    const eaten = FOOD_LOG.reduce((acc, f) => ({ kcal: acc.kcal + f.kcal, protein: acc.protein + f.protein, carbs: acc.carbs + f.carbs, fat: acc.fat + f.fat }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });
    return (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <div className="glass p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="lbl" style={{ color: 'var(--ac-b)' }}>MACROS · TODAY</div>
              <span className="chip chip-ac">{Math.round((eaten.kcal/targets.kcal)*100)}% TO TARGET</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { l: 'CALORIES', v: eaten.kcal, t: targets.kcal, u: 'kcal', c: 'var(--ac)' },
                { l: 'PROTEIN', v: eaten.protein, t: targets.protein, u: 'g', c: 'var(--cy)' },
                { l: 'CARBS', v: eaten.carbs, t: targets.carbs, u: 'g', c: 'var(--purple)' },
                { l: 'FAT', v: eaten.fat, t: targets.fat, u: 'g', c: 'var(--warn)' },
              ].map((x, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Ring pct={(x.v/x.t)*100} size={84} color={x.c} label={`${x.v}`} sublabel={x.u} />
                  <div>
                    <div className="lbl">{x.l}</div>
                    <div className="text-xs mt-1 mono num" style={{ color: 'var(--ink-s)' }}>of {x.t}{x.u}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="lbl" style={{ color: 'var(--ac-b)' }}>FOOD LOG · TODAY</div>
              <div className="flex items-center gap-2">
                <button className="btn-gh">Scan barcode</button>
                <button className="btn-ac">Log meal</button>
              </div>
            </div>
            <div className="space-y-3">
              {FOOD_LOG.map((f, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
                  <div className="mono num text-xs" style={{ color: 'var(--ink-m)', width: 50 }}>{f.time}</div>
                  <div className="flex-1">
                    <div className="text-sm" style={{ fontWeight: 500 }}>{f.meal}</div>
                    <div className="lbl mt-1" style={{ fontSize: 9 }}>{f.kcal} kcal · {f.protein}P · {f.carbs}C · {f.fat}F</div>
                  </div>
                  {f.flag === 'good' && <span className="chip chip-ac">good</span>}
                  {f.flag === 'warn' && <span className="chip chip-warn">flag</span>}
                </div>
              ))}
              <div className="text-xs text-center py-3" style={{ color: 'var(--ink-m)' }}>
                Dinner not logged · Telos will check in at 19:00
              </div>
            </div>
          </div>

          <div className="glass p-7">
            <div className="flex items-center justify-between mb-2">
              <div className="lbl" style={{ color: 'var(--ac-b)' }}>FOOD INTELLIGENCE · INGREDIENT FLAGS</div>
              <span className="chip">SCANNER</span>
            </div>
            <div className="serif text-xl mb-2" style={{ fontWeight: 400 }}>What's in this?</div>
            <div className="text-sm mb-4 mono" style={{ color: 'var(--ink-s)' }}>
              <span style={{ color: 'var(--ink-m)' }}>SCANNED: </span>Trader Joe's Tikka Masala (frozen)
            </div>
            <div className="space-y-2 mb-4">
              {FLAGS.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{
                    background: f.level === 'warn' ? 'rgba(255,184,122,0.07)' : 'rgba(120,220,170,0.07)',
                    border: `1px solid ${f.level === 'warn' ? 'rgba(255,184,122,0.20)' : 'rgba(120,220,170,0.18)'}`,
                  }}
                >
                  <span className="mt-0.5 dot" style={{ background: f.level === 'warn' ? 'var(--warn)' : 'var(--good)', boxShadow: `0 0 8px ${f.level === 'warn' ? 'var(--warn)' : 'var(--good)'}` }} />
                  <div>
                    <div className="text-xs" style={{ fontWeight: 600, color: f.level === 'warn' ? '#FFD9A0' : '#A8E8C8' }}>{f.ingredient}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--ink-s)' }}>{f.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>LINGO · GLUCOSE · 24h</div>
            <div className="mono num text-3xl mb-1">{GLUCOSE_STATS.avg}<span className="text-base" style={{ color: 'var(--ink-m)' }}>mg/dL</span></div>
            <div className="lbl mb-3" style={{ fontSize: 9 }}>AVG · GMI {GLUCOSE_STATS.gmi}</div>
            <Sparkline values={GLUCOSE_TRACE} color="var(--cy)" height={90} fill />
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: '1px dashed var(--line-s)' }}>
              <div><div className="lbl">PEAK</div><div className="mono num text-sm">{GLUCOSE_STATS.peak}</div></div>
              <div><div className="lbl">TIR</div><div className="mono num text-sm">{GLUCOSE_STATS.tir}%</div></div>
              <div><div className="lbl">SPIKES</div><div className="mono num text-sm">{GLUCOSE_STATS.spikes}</div></div>
            </div>
          </div>

          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>HYDRATION</div>
            <div className="flex items-center justify-between mb-3">
              <div className="mono num text-2xl">{HYDRATION.current}<span className="text-base" style={{ color: 'var(--ink-m)' }}>/{HYDRATION.target}L</span></div>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
              <div style={{ width: `${(HYDRATION.current/HYDRATION.target)*100}%`, height: '100%', background: 'linear-gradient(90deg, var(--cy), var(--cy-b))', boxShadow: '0 0 12px var(--cy)' }} />
            </div>
          </div>

          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>MEAL SUGGESTIONS</div>
            <div className="text-xs mb-4" style={{ color: 'var(--ink-s)' }}>Based on remaining macros: 53g protein, 158g carbs.</div>
            <div className="space-y-3">
              {[
                { name: 'Salmon · jasmine rice · greens', p: 38, k: 620, t: '~20m' },
                { name: 'Turkey chili · cornbread', p: 42, k: 580, t: '~15m' },
                { name: 'Tofu stir-fry · quinoa', p: 32, k: 560, t: '~18m' },
              ].map((meal, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
                  <div className="text-sm mb-1" style={{ fontWeight: 500 }}>{meal.name}</div>
                  <div className="lbl" style={{ fontSize: 9 }}>{meal.p}g protein · {meal.k} kcal · {meal.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Movement() {
    return (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <div className="glass p-7 glow">
            <div className="flex items-center justify-between mb-3">
              <div className="lbl" style={{ color: 'var(--ac-b)' }}>TODAY · {TODAY_WORKOUT.time}</div>
              <span className="chip chip-ac"><span className="dot dot-ac pulse" /> {TODAY_WORKOUT.status.toUpperCase()}</span>
            </div>
            <div className="serif text-2xl mb-2" style={{ fontWeight: 400 }}>{TODAY_WORKOUT.title}</div>
            <div className="text-sm mb-6" style={{ color: 'var(--ink-s)' }}>{TODAY_WORKOUT.detail}</div>

            <div className="space-y-2">
              {[
                { ex: 'Bench press', set: '4×6 @ 95 lb', rest: '120s', done: false },
                { ex: 'Incline DB press', set: '3×10 @ 25s', rest: '90s', done: false },
                { ex: 'Cable row', set: '3×12 @ 80', rest: '75s', done: false },
                { ex: 'Tricep pushdown', set: '3×12 @ 60', rest: '60s', done: false },
                { ex: 'Face pull', set: '3×15 @ 40', rest: '45s', done: false },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
                  <input type="checkbox" defaultChecked={e.done} style={{ accentColor: 'var(--ac)' }} />
                  <div className="flex-1">
                    <div className="text-sm" style={{ fontWeight: 500 }}>{e.ex}</div>
                    <div className="lbl mt-0.5" style={{ fontSize: 9 }}>{e.set} · rest {e.rest}</div>
                  </div>
                  <button className="btn-gh" style={{ padding: '6px 10px', fontSize: 10 }}>Log</button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-5">
              <button className="btn-ac">Start workout</button>
              <button className="btn-gh">Swap exercise</button>
            </div>
          </div>

          <div className="glass p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="lbl" style={{ color: 'var(--ac-b)' }}>THIS WEEK · 4 OF 7 DONE</div>
              <span className="chip chip-warn">2 MISSED</span>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {WORKOUTS_WEEK.map((w, i) => {
                const color = w.status === 'done' ? 'var(--ac)' : w.status === 'missed' ? 'var(--warn)' : w.status === 'now' ? 'var(--cy)' : 'var(--ink-m)';
                return (
                  <div key={i} className="p-3 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
                    <div className="lbl mb-2">{w.time}</div>
                    <div className="text-xs mb-1" style={{ fontWeight: 600, color }}>{w.title}</div>
                    <div className="lbl mt-2" style={{ fontSize: 8 }}>{w.status}</div>
                    {w.rpe && <div className="mono num text-[10px] mt-1" style={{ color: 'var(--ink-s)' }}>RPE {w.rpe}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="glass p-6">
            <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>CURRENT PROGRAM</div>
            {PROGRAMS.map((p, i) => (
              <div key={i} className="mb-3 p-4 rounded-lg" style={{ background: p.active ? 'color-mix(in srgb, var(--ac) 8%, transparent)' : 'rgba(255,255,255,0.02)', border: `1px solid ${p.active ? 'color-mix(in srgb, var(--ac) 28%, transparent)' : 'var(--line)'}` }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm" style={{ fontWeight: 500 }}>{p.name}</div>
                  {p.active && <span className="chip chip-ac">ACTIVE</span>}
                </div>
                <div className="lbl mb-2" style={{ fontSize: 9 }}>WEEK {p.weeks}</div>
                <div className="text-xs" style={{ color: 'var(--ink-s)' }}>{p.detail}</div>
              </div>
            ))}
          </div>

          <div className="glass p-6">
            <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>TOTAL VOLUME · 6 WEEKS</div>
            <Sparkline values={[24800, 26100, 25400, 22000, 18200, 14800]} color="var(--ac)" height={90} />
            <div className="flex items-center justify-between mt-3 text-xs mono num" style={{ color: 'var(--ink-s)' }}>
              <span>W1: 24.8k</span>
              <span style={{ color: 'var(--warn)' }}>-40% W1→W6</span>
              <span>W6: 14.8k</span>
            </div>
          </div>

          <div className="glass p-6">
            <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>PERSONAL RECORDS</div>
            <div className="space-y-3">
              {[
                { l: 'Back squat', v: '155 × 5', d: 'Apr 28' },
                { l: 'Bench press', v: '105 × 6', d: 'May 2' },
                { l: 'Romanian DL', v: '135 × 8', d: 'May 9' },
                { l: 'Pull-ups', v: '8 bw', d: 'Apr 21' },
              ].map((pr, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--ink-s)' }}>{pr.l}</span>
                  <span className="mono num text-sm">{pr.v}</span>
                  <span className="lbl" style={{ fontSize: 9 }}>{pr.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Sleep() {
    const last = SLEEP_NIGHTS[SLEEP_NIGHTS.length - 1];
    return (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <div className="glass p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="lbl" style={{ color: 'var(--ac-b)' }}>LAST NIGHT</div>
              <span className="chip chip-warn">SCORE {last.score}</span>
            </div>
            <div className="grid grid-cols-4 gap-6 items-center">
              <Ring pct={last.score} size={128} color="var(--warn)" label={`${last.score}`} sublabel="SCORE" />
              <div>
                <div className="lbl">TOTAL</div>
                <div className="mono num text-3xl">{last.total}h</div>
                <div className="text-[10px] mono" style={{ color: 'var(--warn)' }}>-1.5h vs goal</div>
              </div>
              <div>
                <div className="lbl">DEEP</div>
                <div className="mono num text-3xl">{last.deep}h</div>
                <div className="text-[10px] mono" style={{ color: 'var(--ink-s)' }}>10% of sleep</div>
              </div>
              <div>
                <div className="lbl">REM</div>
                <div className="mono num text-3xl">{last.rem}h</div>
                <div className="text-[10px] mono" style={{ color: 'var(--ink-s)' }}>21% of sleep</div>
              </div>
            </div>
          </div>

          <div className="glass p-7">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>7-NIGHT TREND</div>
            <Sparkline values={SLEEP_NIGHTS.map(s => s.score)} color="var(--warn)" height={100} fill />
            <div className="grid grid-cols-7 gap-2 mt-3">
              {SLEEP_NIGHTS.map((n, i) => (
                <div key={i} className="text-center">
                  <div className="lbl" style={{ fontSize: 8 }}>{n.date}</div>
                  <div className="mono num text-xs mt-1" style={{ color: n.score < 65 ? 'var(--warn)' : 'var(--ac)' }}>{n.score}</div>
                  <div className="mono text-[9px]" style={{ color: 'var(--ink-m)' }}>{n.total}h</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass p-6">
              <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>HRV · 7 DAYS</div>
              <div className="mono num text-3xl mb-1">{last.hrv}<span className="text-base" style={{ color: 'var(--ink-m)' }}>ms</span></div>
              <div className="lbl mb-3" style={{ color: 'var(--warn)', fontSize: 9 }}>-16 ms vs baseline</div>
              <Sparkline values={SLEEP_NIGHTS.map(s => s.hrv)} color="var(--warn)" height={70} />
            </div>
            <div className="glass p-6">
              <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>RESTING HR · 7 DAYS</div>
              <div className="mono num text-3xl mb-1">{last.rhr}<span className="text-base" style={{ color: 'var(--ink-m)' }}>bpm</span></div>
              <div className="lbl mb-3" style={{ color: 'var(--warn)', fontSize: 9 }}>+8 bpm vs baseline</div>
              <Sparkline values={SLEEP_NIGHTS.map(s => s.rhr)} color="var(--warn)" height={70} fill={false} />
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="glass p-6 glow-cy">
            <div className="lbl mb-3" style={{ color: 'var(--cy)' }}>RECOVERY SCORE</div>
            <Ring pct={42} size={160} stroke={12} color="var(--warn)" label="42" sublabel="OF 100" />
            <div className="text-sm mt-4 text-center" style={{ color: 'var(--ink-s)' }}>
              Body is signaling load. Telos has shifted to minimum-effective for 7 days.
            </div>
          </div>

          <div className="glass p-6">
            <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>SLEEP HYGIENE</div>
            <div className="space-y-3">
              {[
                { l: 'No caffeine after 14:00', d: '3/7 days', ok: false },
                { l: 'Screens off by 22:30', d: '5/7 days', ok: true },
                { l: 'Room < 68°F', d: '7/7 days', ok: true },
                { l: 'Same bedtime ±30m', d: '4/7 days', ok: false },
                { l: 'Magnesium evening', d: '6/7 days', ok: true },
              ].map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="dot" style={{ background: h.ok ? 'var(--ac)' : 'var(--warn)', boxShadow: `0 0 6px ${h.ok ? 'var(--ac)' : 'var(--warn)'}` }} />
                  <div className="flex-1">
                    <div className="text-xs" style={{ fontWeight: 500 }}>{h.l}</div>
                    <div className="lbl mt-0.5" style={{ fontSize: 9 }}>{h.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>MIND CHECK-IN</div>
            <div className="text-sm mb-4" style={{ color: 'var(--ink-s)' }}>Telos asks once a day. Anonymized to your analyst.</div>
            <div className="grid grid-cols-5 gap-2">
              {['😞', '😕', '🙂', '😊', '😄'].map((e, i) => (
                <button key={i} className="text-2xl p-2 rounded-lg" style={{ background: i === 1 ? 'color-mix(in srgb, var(--ac) 12%, transparent)' : 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>{e}</button>
              ))}
            </div>
            <div className="lbl mt-3 text-center" style={{ fontSize: 9 }}>YESTERDAY · LOW</div>
          </div>
        </div>
      </div>
    );
  }

  function Telos() {
    return (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <Chat
            initial={MAYA_CHAT}
            title="Telos"
            subtitle="BETWEEN-SCAN CONTINUITY · MAYA"
            scope="PRIVATE TO YOU"
            placeholder="Tell Telos how you're doing…"
          />
        </div>
        <div className="col-span-5 space-y-6">
          <div className="glass p-6 glow-cy">
            <div className="lbl mb-3" style={{ color: 'var(--cy)' }}>WHAT TELOS KNOWS TODAY</div>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--ink-s)' }}>
              {[
                'Adherence dipped 95% → 48% over weeks 4–6.',
                'Sleep avg 5:42 last 7 nights. HRV depressed 38ms.',
                'Lingo: 3 glucose spikes/day, all post-dinner.',
                'Disclosed: high cognitive-load period from family health.',
                'Workouts: 4 of 7 this week. 2 missed mid-week.',
              ].map((x, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 dot dot-cy" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>WHAT THE ANALYST SEES</div>
            <div className="text-sm mb-2" style={{ color: 'var(--ink-s)' }}>
              <span className="lbl mr-2">PATTERN</span>High cognitive-load period · last 72h
            </div>
            <div className="text-sm mb-4" style={{ color: 'var(--ink-s)' }}>
              <span className="lbl mr-2">SIGNAL</span>Adherence likely to drop. Recommend simplified structure 2–4 weeks. Do not press.
            </div>
            <button className="btn-gh" style={{ width: '100%' }}>Surface a topic to your analyst</button>
          </div>

          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>CONVERSATION HISTORY</div>
            <div className="space-y-2 text-xs" style={{ color: 'var(--ink-s)' }}>
              {['Today · morning check-in', 'May 11 · sleep concern', 'May 9 · post-workout', 'May 7 · meal planning', 'May 5 · DEXA reaction'].map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 4 ? '1px dashed var(--line)' : 'none' }}>
                  <span style={{ color: 'var(--ink)' }}>{c}</span>
                  <span className="mono" style={{ fontSize: 10 }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
