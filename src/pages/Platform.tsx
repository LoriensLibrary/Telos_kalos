export default function Platform() {
  return (
    <div className="max-w-[1400px] mx-auto px-8 py-16">
      <div className="mb-10">
        <div className="lbl mb-5" style={{ color: '#A0F0C8' }}>
          PLATFORM ARCHITECTURE
        </div>
        <h1
          style={{
            fontSize: 'clamp(2.8rem,5vw,4.5rem)',
            lineHeight: 0.97,
            letterSpacing: '-0.03em',
            fontWeight: 300,
          }}
        >
          Web app. Mobile app.
          <br />
          <em
            className="serif italic"
            style={{ fontWeight: 400, color: '#A0F0C8' }}
          >
            Same codebase.
          </em>
        </h1>
        <p className="mt-4 text-base max-w-2xl" style={{ color: 'rgba(245,247,250,0.66)' }}>
          Built on the stack Kalos already runs: TypeScript, React, Node, Python, PostgreSQL,
          SQL Server. AI-augmented dev workflow with Claude Code and Cursor.
        </p>
      </div>

      {/* STACK CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-16">
        {[
          {
            title: 'Web App',
            sub: 'app.livekalos.com',
            items: [
              'React 19 + TypeScript',
              'Responsive desktop + tablet',
              'Coach dashboard optimized',
              'Real-time API · PostgreSQL',
            ],
            color: '#A0F0C8',
          },
          {
            title: 'Mobile (PWA)',
            sub: 'Install from browser',
            items: [
              'Same React codebase',
              'Installable iOS + Android',
              'Camera for food scanning',
              'Push notifications',
            ],
            color: '#7DD3FC',
          },
          {
            title: 'Native (Phase 3)',
            sub: 'App Store + Play Store',
            items: [
              'React Native bridge',
              'Apple HealthKit native',
              'Lingo / Stelo BLE pairing',
              'Background wearable sync',
            ],
            color: '#B49AFF',
          },
        ].map((c, i) => (
          <div key={i} className="glass p-8">
            <div className="text-lg mb-1" style={{ fontWeight: 600 }}>
              {c.title}
            </div>
            <div className="lbl mb-5" style={{ color: c.color }}>
              {c.sub}
            </div>
            <ul className="space-y-2">
              {c.items.map((item, j) => (
                <li key={j} className="text-xs flex items-start gap-2">
                  <span
                    className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: c.color }}
                  />
                  <span style={{ color: 'rgba(245,247,250,0.78)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* STACK ROW */}
      <div className="glass p-10 mb-12">
        <div className="lbl mb-6" style={{ color: '#A0F0C8' }}>
          MATCHES THE KALOS HIRING SPEC
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { l: 'FRONTEND', v: 'TypeScript · React 19' },
            { l: 'BACKEND', v: 'Node.js · Python' },
            { l: 'DATA', v: 'PostgreSQL · SQL Server' },
            { l: 'AI WORKFLOW', v: 'Claude Code · Cursor' },
            { l: 'INTEGRATION', v: 'DEXA · Lingo · Whoop · HealthKit' },
            { l: 'INFRA', v: 'Cloud-native · edge-cached' },
            { l: 'AUTH', v: 'OAuth · Apple Sign-in' },
            { l: 'OBSERVABILITY', v: 'OpenTelemetry · traced' },
          ].map((s, i) => (
            <div
              key={i}
              className="p-4 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="lbl mb-2">{s.l}</div>
              <div className="text-sm" style={{ color: '#F5F7FA', fontWeight: 500 }}>
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BUILDER */}
      <div className="glass glow-cy p-10">
        <div className="lbl mb-4" style={{ color: '#7DD3FC' }}>
          ABOUT THE BUILDER
        </div>
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-7">
            <p
              className="text-lg leading-relaxed mb-4"
              style={{ color: 'rgba(245,247,250,0.84)' }}
            >
              <strong style={{ color: '#F5F7FA' }}>Angela Reinhold</strong>{' '}
              <span style={{ color: 'rgba(245,247,250,0.42)' }}>·</span> Independent AI
              Researcher{' '}
              <span style={{ color: 'rgba(245,247,250,0.42)' }}>·</span> CS Student (AI),
              Full Sail University
            </p>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: 'rgba(245,247,250,0.66)' }}
            >
              Architect of CAMA — 53,000+ memories, 151,000+ relational edges, 55 MCP tools.
              11 published papers on Zenodo. This demo was built solo, end-to-end, in the
              same workflow Kalos hires for.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                'TypeScript · React',
                'Python · Node.js',
                'PostgreSQL · SQLite',
                'Claude · Embeddings · RAG',
                'ORCID 0009-0005-5803-8401',
                '11 papers · Zenodo',
              ].map((t, i) => (
                <span key={i} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="col-span-5">
            <div
              className="p-6 rounded-xl"
              style={{
                background: 'rgba(125,211,252,0.05)',
                border: '1px solid rgba(125,211,252,0.18)',
              }}
            >
              <div className="lbl mb-3" style={{ color: '#7DD3FC' }}>
                WHY THIS, WHY NOW
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(245,247,250,0.84)' }}
              >
                The Kalos software engineer posting names three work streams: consumer
                products, body-composition science, and{' '}
                <em
                  className="serif italic"
                  style={{ color: '#A0F0C8', fontStyle: 'italic' }}
                >
                  AI-powered internal tools trained on thousands of real coaching
                  conversations.
                </em>{' '}
                Telos is a working prototype of #3.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
