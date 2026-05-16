import { SLEEP_NIGHTS } from '../../data/day';
import Ring from '../../components/charts/Ring';
import Sparkline from '../../components/charts/Sparkline';

export default function SleepTab() {
  const last = SLEEP_NIGHTS[SLEEP_NIGHTS.length - 1];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="col-span-1 lg:col-span-8 space-y-6">
        <div className="glass p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="lbl" style={{ color: 'var(--ac-b)' }}>LAST NIGHT</div>
            <span className="chip chip-warn">SCORE {last.score}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

      <div className="col-span-1 lg:col-span-4 space-y-6">
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
