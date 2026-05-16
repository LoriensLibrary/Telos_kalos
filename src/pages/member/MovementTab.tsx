import { WORKOUTS_WEEK, TODAY_WORKOUT, PROGRAMS } from '../../data/day';
import Sparkline from '../../components/charts/Sparkline';

export default function MovementTab() {
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
