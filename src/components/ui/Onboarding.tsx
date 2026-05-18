import { ONBOARDING_FLOW } from '../../data/schedule';

const stateColor: Record<string, string> = {
  done: 'var(--ac)',
  now: 'var(--cy)',
  next: 'var(--ac-b)',
  queued: 'var(--ink-m)',
};

export default function Onboarding() {
  const done = ONBOARDING_FLOW.filter((s) => s.status === 'done').length;
  const pct = Math.round((done / ONBOARDING_FLOW.length) * 100);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 space-y-6">
        {/* welcome card */}
        <div className="glass glow p-10">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>NEW MEMBER · WELCOME</div>
          <h2 className="serif text-4xl mb-4" style={{ fontWeight: 400 }}>
            Welcome to Kalos.
          </h2>
          <p className="text-base mb-6" style={{ color: 'var(--ink-s)' }}>
            You're about to get the clearest picture of your body anyone has ever shown you. Then a Performance Analyst
            trained to read what your data is telling you is going to help you act on it. Here's how the first three weeks unfold.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
              <div className="lbl mb-1">PROGRESS</div>
              <div className="mono num text-3xl">{pct}%</div>
              <div className="lbl mt-1" style={{ fontSize: 9 }}>{done} OF {ONBOARDING_FLOW.length} STEPS COMPLETE</div>
              <div className="mt-3" style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--ac), var(--ac-b))',
                  borderRadius: 999,
                  boxShadow: '0 0 12px var(--ac)',
                }} />
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'color-mix(in srgb, var(--cy) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--cy) 28%, transparent)' }}>
              <div className="lbl mb-1" style={{ color: 'var(--cy)' }}>NEXT STEP</div>
              <div className="text-base" style={{ fontWeight: 500 }}>Pair wearables</div>
              <div className="text-xs mt-1" style={{ color: 'var(--ink-s)' }}>
                ~15 min. Whoop strap issued at intake. Apple Health + MyFitnessPal connect in-app.
              </div>
              <button className="btn-ac mt-3" style={{ width: '100%' }}>Start step</button>
            </div>
          </div>
        </div>

        {/* step-by-step */}
        <div className="glass p-7">
          <div className="lbl mb-5" style={{ color: 'var(--ac-b)' }}>FIRST 30 DAYS · STEP BY STEP</div>
          <div className="space-y-3">
            {ONBOARDING_FLOW.map((s) => (
              <div
                key={s.num}
                className="flex items-stretch gap-4 p-4 rounded-xl"
                style={{
                  background: s.status === 'now' ? 'color-mix(in srgb, var(--cy) 8%, transparent)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${s.status === 'now' ? 'color-mix(in srgb, var(--cy) 30%, transparent)' : 'var(--line)'}`,
                  opacity: s.status === 'queued' ? 0.55 : 1,
                }}
              >
                <div style={{ width: 60, flexShrink: 0 }}>
                  <div className="mono num text-2xl" style={{ color: stateColor[s.status], fontWeight: 300 }}>{s.num}</div>
                  <div className="lbl mt-1" style={{ fontSize: 9 }}>{s.duration}</div>
                </div>
                <div style={{ width: 1, background: stateColor[s.status], opacity: 0.4 }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className="text-base" style={{ fontWeight: 500 }}>{s.title}</div>
                    <span
                      className="chip"
                      style={{
                        color: stateColor[s.status],
                        borderColor: `color-mix(in srgb, ${stateColor[s.status]} 30%, transparent)`,
                        background: `color-mix(in srgb, ${stateColor[s.status]} 7%, transparent)`,
                      }}
                    >
                      {s.status === 'now' && <span className="dot dot-cy pulse" />}
                      {s.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--ink-s)' }}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* explainers */}
        <div className="grid grid-cols-2 gap-5">
          {[
            {
              t: 'Why a DEXA first?',
              b: 'Because the scale lies and the mirror is biased. DEXA gives a numeric baseline for fat, lean, and bone, segmented by region. Without it, every coaching decision is a guess.',
            },
            {
              t: 'Why wearables matter',
              b: 'Sleep, HRV, glucose, and recovery between scans are what determine if your plan is working in real time — long before the next scan confirms.',
            },
            {
              t: 'What Telos does',
              b: 'Listens to your data, checks in daily, surfaces patterns to your analyst as signals (not raw text), and drafts the kind of message your analyst would have written anyway — faster.',
            },
            {
              t: 'Your Performance Analyst',
              b: 'A trained athlete + data scientist. They review every Telos suggestion before it reaches you. The plan is human-built, data-informed.',
            },
          ].map((e) => (
            <div key={e.t} className="glass p-6">
              <div className="serif text-xl mb-2" style={{ fontWeight: 400 }}>{e.t}</div>
              <p className="text-sm" style={{ color: 'var(--ink-s)' }}>{e.b}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-4 space-y-6">
        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>YOUR ONBOARDING ANALYST</div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center serif text-lg"
              style={{
                background: 'color-mix(in srgb, var(--ac) 14%, transparent)',
                color: 'var(--ac-b)',
                border: '1px solid color-mix(in srgb, var(--ac) 30%, transparent)',
              }}
            >
              J
            </div>
            <div>
              <div className="text-sm" style={{ fontWeight: 500 }}>Analyst 2</div>
              <div className="lbl mt-1" style={{ fontSize: 9 }}>METABOLIC HEALTH · NASM CPT</div>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--ink-s)' }}>
            Your assigned analyst for the first 30 days. After scan #2, you can switch if a different specialty
            (longevity, performance, aesthetics) fits better.
          </p>
        </div>

        <div className="glass p-6 glow-cy">
          <div className="lbl mb-3" style={{ color: 'var(--cy)' }}>WHAT YOU'LL GET IN 90 DAYS</div>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--ink-s)' }}>
            {[
              '3 DEXA scans with an analyst-led readout each',
              'A Triangle baseline + first projection',
              'Wearable streams integrated into one view',
              'A program tuned to YOUR data, not a template',
              'Weekly check-ins · always between scans',
            ].map((x, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 dot dot-cy" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>QUESTIONS</div>
          <p className="text-sm mb-3" style={{ color: 'var(--ink-s)' }}>
            Anything unclear? Telos answers 24/7. Your analyst answers same-day on weekdays.
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-ac">Ask Telos</button>
            <button className="btn-gh">Message analyst</button>
          </div>
        </div>
      </div>
    </div>
  );
}
