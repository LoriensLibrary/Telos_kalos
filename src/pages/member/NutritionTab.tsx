import { HYDRATION, FOOD_LOG, GLUCOSE_TRACE, GLUCOSE_STATS } from '../../data/day';
import Ring from '../../components/charts/Ring';
import Sparkline from '../../components/charts/Sparkline';
import { FLAGS } from './shared';

export default function NutritionTab() {
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
