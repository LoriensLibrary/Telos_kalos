import DEXAChart from '../../components/charts/DEXAChart';
import TriangleChart from '../../components/charts/TriangleChart';
import Sparkline from '../../components/charts/Sparkline';
import { m } from './shared';

export default function BodyTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="col-span-1 lg:col-span-8 space-y-6">
        <div className="glass p-7">
          <div className="flex items-center justify-between mb-2">
            <div className="lbl" style={{ color: 'var(--ac-b)' }}>DEXA BODY COMPOSITION · 6 SCANS</div>
            <span className="chip chip-ac">TRENDING</span>
          </div>
          <div className="serif text-xl mb-4" style={{ fontWeight: 400 }}>Your body, measured over time</div>
          <DEXAChart data={m.scans} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4" style={{ borderTop: '1px dashed var(--line-s)' }}>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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

      <div className="col-span-1 lg:col-span-4 space-y-6">
        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>YOUR TRIANGLE</div>
          <TriangleChart scores={m.triangle} projected={m.triProj} size={200} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 pt-4" style={{ borderTop: '1px dashed var(--line-s)' }}>
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
