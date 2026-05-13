export default function DataArch() {
  return (
    <div className="max-w-[1400px] mx-auto px-8 py-16">
      <div className="mb-10">
        <div className="lbl mb-5" style={{ color: '#A0F0C8' }}>
          DATA PRIVACY · DUAL-VIEW ARCHITECTURE
        </div>
        <h1
          style={{
            fontSize: 'clamp(2.8rem,5vw,4.5rem)',
            lineHeight: 0.97,
            letterSpacing: '-0.03em',
            fontWeight: 300,
          }}
        >
          Same event.{' '}
          <em className="serif italic" style={{ fontWeight: 400, color: '#A0F0C8' }}>
            Two useful views.
          </em>
        </h1>
        <p className="mt-4 text-base max-w-2xl" style={{ color: 'rgba(245,247,250,0.66)' }}>
          Members confide raw context. Coaches act on operational signal. Telos is the
          interpreter — and the seal between them.
        </p>
      </div>

      <div className="glass overflow-hidden mb-12">
        <div className="grid grid-cols-2">
          <div
            className="p-10"
            style={{ borderRight: '1px dashed rgba(255,255,255,0.10)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="lbl" style={{ color: '#FF9988' }}>
                WHAT MAYA SEES
              </div>
              <span className="chip chip-priv">PRIVATE TO YOU</span>
            </div>
            <div className="serif text-xl mb-4" style={{ fontWeight: 400 }}>
              A private surface
            </div>
            <div className="bub bub-ai mb-4" style={{ maxWidth: '100%' }}>
              "I had a hard call with my mom about her health and I've been eating around it.
              Three nights of takeout, no workouts."
            </div>
            <div className="text-xs" style={{ color: 'rgba(245,247,250,0.40)' }}>
              Feeds the pattern engine. Text sealed to member. Coach never reads this.
            </div>
          </div>
          <div className="p-10">
            <div className="flex items-center justify-between mb-6">
              <div className="lbl" style={{ color: '#A0F0C8' }}>
                WHAT JAMES SEES
              </div>
              <span className="chip chip-ac">OPERATIONAL SIGNAL</span>
            </div>
            <div className="serif text-xl mb-4" style={{ fontWeight: 400 }}>
              A coachable signal
            </div>
            <p className="text-sm mb-2">
              <span className="lbl mr-2">PATTERN</span>High cognitive-load period — last 72h
            </p>
            <p
              className="text-sm mb-5"
              style={{ color: 'rgba(245,247,250,0.78)' }}
            >
              <span className="lbl mr-2">SIGNAL</span>Adherence likely to drop. Recommend
              simplified structure 2–4 weeks. Do not press.
            </p>
            <div className="text-xs" style={{ color: 'rgba(245,247,250,0.40)' }}>
              Pattern derived from disclosure. Source not exposed. Sufficient for coaching.
            </div>
          </div>
        </div>
      </div>

      {/* PIPELINE */}
      <div className="mb-6 lbl" style={{ color: '#A0F0C8' }}>
        THE PIPELINE
      </div>
      <div className="glass p-10">
        <div className="grid grid-cols-5 gap-4 items-stretch">
          {[
            {
              n: '01',
              t: 'Raw disclosure',
              b: 'Member writes freely to Telos. Stored encrypted at rest.',
              c: '#FF9988',
            },
            {
              n: '02',
              t: 'Pattern extraction',
              b: 'Model classifies signals: load, recovery, motivation, disclosure type.',
              c: '#B49AFF',
            },
            {
              n: '03',
              t: 'Trend join',
              b: 'Signals joined to DEXA, wearable, adherence, Lingo over rolling window.',
              c: '#7DD3FC',
            },
            {
              n: '04',
              t: 'Coach surface',
              b: 'Coach sees: pattern, recommendation, confidence. Not source text.',
              c: '#A0F0C8',
            },
            {
              n: '05',
              t: 'Member control',
              b: 'Member can surface any topic to coach explicitly. One tap, one direction.',
              c: '#A0F0C8',
            },
          ].map((s, i) => (
            <div
              key={i}
              className="p-5 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                className="mono num text-2xl mb-3"
                style={{ color: s.c, fontWeight: 300 }}
              >
                {s.n}
              </div>
              <div className="text-sm mb-2" style={{ fontWeight: 600 }}>
                {s.t}
              </div>
              <div
                className="text-xs leading-relaxed"
                style={{ color: 'rgba(245,247,250,0.66)' }}
              >
                {s.b}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRINCIPLES */}
      <div className="grid grid-cols-3 gap-6 mt-12">
        {[
          {
            t: 'Pattern, not text',
            b: "Coaches receive interpretations. They never read the member's raw words unless the member explicitly surfaces them.",
          },
          {
            t: 'Member-controlled disclosure',
            b: 'One-way valve. Members can promote any private exchange into the coach view. Coaches cannot pull.',
          },
          {
            t: 'Auditable model',
            b: 'Every Telos suggestion is traceable to the Kalos coaching corpus. Source-quoted, never hallucinated.',
          },
        ].map((p, i) => (
          <div key={i} className="glass p-7">
            <div className="lbl mb-3" style={{ color: '#A0F0C8' }}>
              PRINCIPLE {String(i + 1).padStart(2, '0')}
            </div>
            <div className="text-base mb-2" style={{ fontWeight: 500 }}>
              {p.t}
            </div>
            <div
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(245,247,250,0.66)' }}
            >
              {p.b}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
