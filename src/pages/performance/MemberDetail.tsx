import { CLIENTS } from '../../data/clients';
import DEXAChart from '../../components/charts/DEXAChart';
import AdherenceChart from '../../components/charts/AdherenceChart';
import TriangleChart from '../../components/charts/TriangleChart';

export default function MemberDetail({ client: c, onBack }: { client: typeof CLIENTS[number]; onBack: () => void }) {
  return (
    <div className="max-w-[1500px] mx-auto px-8 py-14">
      <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm cursor-pointer" style={{ color: 'var(--ac-b)', background: 'none', border: 'none' }}>
        ← Back to caseload
      </button>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center serif text-2xl" style={{ background: 'color-mix(in srgb, var(--ac) 14%, transparent)', color: 'var(--ac-b)', border: '1px solid color-mix(in srgb, var(--ac) 30%, transparent)' }}>{c.init}</div>
        <div>
          <div className="text-xl" style={{ fontWeight: 600 }}>{c.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`chip ${
                c.status === 'flagged'
                  ? 'chip-warn'
                  : c.status === 'plateau'
                  ? ''
                  : c.status === 'new'
                  ? 'chip-cy'
                  : 'chip-ac'
              }`}
            >
              {c.status}
            </span>
            <span className="lbl">NEXT: {c.next}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-1 lg:col-span-8 space-y-6">
          <div className="glass p-7">
            <div className="lbl mb-2" style={{ color: 'var(--ac-b)' }}>DEXA BODY COMPOSITION</div>
            <DEXAChart data={c.scans} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4" style={{ borderTop: '1px dashed var(--line-s)' }}>
              {[{ l: 'BODY FAT', v: c.met.fat, d: c.met.fatD }, { l: 'LEAN MASS', v: c.met.lean, d: c.met.leanD }, { l: 'VISCERAL', v: c.met.visc, d: c.met.viscD }].map((x, i) => (
                <div key={i}><div className="lbl mb-1">{x.l}</div><div className="mono text-xl num" style={{ fontWeight: 300 }}>{x.v}</div><div className="text-[10px] mono" style={{ color: 'var(--ac)' }}>{x.d}</div></div>
              ))}
            </div>
          </div>
          <div className="glass p-7">
            <div className="lbl mb-2" style={{ color: 'var(--ac-b)' }}>ADHERENCE · 6 WEEKS</div>
            <AdherenceChart data={c.adh} />
          </div>
          <div className="glass p-7">
            <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>WEARABLE SNAPSHOT</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[{ l: 'HRV', v: c.wear.hrv }, { l: 'SLEEP', v: c.wear.sleep }, { l: 'RECOVERY', v: c.wear.recov }, { l: 'GLUCOSE', v: c.wear.glu }].map((w, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
                  <div className="lbl mb-1">{w.l}</div>
                  <div className="mono text-lg num" style={{ fontWeight: 400, color: (w.v.includes('↓') || w.v.includes('↑')) ? 'var(--warn)' : 'var(--ink)' }}>{w.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass glow p-7">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>AI-SUGGESTED ADJUSTMENT</div>
            <div className="text-sm mb-2"><span className="lbl mr-2">SUGGEST</span>{c.sug.change}</div>
            <div className="text-xs mb-4" style={{ color: 'var(--ink-s)' }}><span className="lbl mr-2">PATTERN</span>{c.sug.reason}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="chip">AI · KALOS CORPUS PATTERN</span>
              <button className="btn-ac">Approve</button>
              <button className="btn-gh">Edit</button>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-4 space-y-6">
          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>TRIANGLE</div>
            <TriangleChart scores={c.triangle} projected={c.triProj} size={190} />
          </div>
          <div className="glass glow-cy p-6">
            <div className="lbl mb-2" style={{ color: 'var(--cy)' }}>PRE-SESSION BRIEF</div>
            <div className="text-xs mono mb-4" style={{ color: 'var(--ink-m)' }}>{c.brief.when}</div>
            {c.brief.rows.map((r, i) => (
              <div key={i} className="text-xs leading-relaxed mb-3" style={{ color: 'var(--ink-s)' }}>
                <span className="mono" style={{ color: 'var(--ac-b)' }}>{String(i + 1).padStart(2, '0')} </span>{r}
              </div>
            ))}
            <hr style={{ border: 'none', borderTop: '1px dashed var(--line-s)', margin: '12px 0' }} />
            <div className="lbl mb-2">TALKING POINTS</div>
            {c.brief.pts.map((t, i) => (
              <div key={i} className="text-xs leading-relaxed flex gap-2 mb-2" style={{ color: 'var(--ink-s)' }}>
                <span className="mono num" style={{ color: 'var(--ac-b)', fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
          {c.flag && (
            <div className="p-5 rounded-xl" style={{ background: 'color-mix(in srgb, var(--warn) 7%, transparent)', border: '1px solid color-mix(in srgb, var(--warn) 22%, transparent)' }}>
              <div className="lbl mb-2" style={{ color: 'var(--warn)' }}>FLAG</div>
              <div className="text-xs" style={{ color: '#FFD9A0' }}>{c.flag}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
