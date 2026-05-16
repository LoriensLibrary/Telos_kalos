import { TODAY_RINGS, HYDRATION, TODAY_WORKOUT, SUPPLEMENTS, GOALS } from '../../data/day';
import Ring from '../../components/charts/Ring';
import TriangleChart from '../../components/charts/TriangleChart';
import { m, ringColors, ringTrack } from './shared';

export default function TodayTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="col-span-1 lg:col-span-8 space-y-6">
        {/* RINGS */}
        <div className="glass p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="lbl" style={{ color: 'var(--ac-b)' }}>TODAY · ACTIVITY RINGS</div>
            <span className="chip chip-ac">68% TO TARGET</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TODAY_RINGS.map((r, i) => (
              <div key={r.label} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
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
      <div className="col-span-1 lg:col-span-4 space-y-6">
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
