import TriangleChart from '../components/charts/TriangleChart';
import { Link } from 'react-router-dom';

export default function Overview() {
  return (
    <div className="max-w-[1400px] mx-auto px-8 py-20">
      {/* HERO */}
      <div className="grid grid-cols-12 gap-8 mb-24">
        <div className="col-span-7">
          <div className="flex items-center gap-3 mb-8">
            <span className="chip chip-ac">
              <span className="dot dot-ac" /> TELOS · v0.6
            </span>
            <span className="chip">FOR LIVEKALOS.COM</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(3.5rem,7vw,6rem)',
              lineHeight: 0.96,
              letterSpacing: '-0.04em',
              fontWeight: 300,
            }}
          >
            Your scan{' '}
            <span className="serif italic" style={{ fontWeight: 400, color: 'var(--ac-b)' }}>
              becomes a plan.
            </span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.62)' }}>Every day in between.</span>
          </h1>
          <p
            className="mt-6 text-base mono"
            style={{ color: 'var(--ac-b)', letterSpacing: '0.08em' }}
          >
            REAL MEMBERS · REAL DEXA DATA · REAL DELTA
          </p>
          <p
            className="mt-6 text-lg leading-relaxed max-w-xl"
            style={{ color: 'rgba(255,255,255,0.72)' }}
          >
            A continuity layer between DEXA scans. Performance Analysts get AI-prepared briefs and
            reviewable draft messages — designed to draw on Kalos's coaching corpus once consent and
            governance land. Members track between visits.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <Link to="/member" className="btn-ac">View Member App →</Link>
            <Link to="/coach" className="btn-gh">View Coach Tools</Link>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl">
            {[
              { v: '6 → 30', l: 'TOUCHPOINTS / QUARTER' },
              { v: 'Auto', l: 'ANALYST PREP · LOADED' },
              { v: 'Always', l: 'ANALYST APPROVES BEFORE SEND' },
            ].map((s, i) => (
              <div key={i}>
                <div
                  className="mono num"
                  style={{ fontSize: 28, fontWeight: 300, color: '#F5F7FA' }}
                >
                  {s.v}
                </div>
                <div className="lbl mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5">
          <div className="glass glow-cy p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="lbl" style={{ color: '#7DD3FC' }}>
                THE KALOS TRIANGLE · OVER TIME
              </div>
              <span className="chip chip-cy">SCAN 6 → 12</span>
            </div>
            <div className="flex justify-center mb-4">
              <TriangleChart scores={[62, 48, 55]} projected={[78, 68, 72]} size={380} />
            </div>
            <div
              className="text-xs text-center"
              style={{ color: 'rgba(245,247,250,0.42)' }}
            >
              Solid = Current (Scan 6) · Dashed = Projected (Scan 12)
            </div>
            <div
              className="mt-5 pt-5 grid grid-cols-3 gap-3"
              style={{ borderTop: '1px dashed rgba(255,255,255,0.10)' }}
            >
              {[
                { l: 'MUSCLE', v: '+4.0 lb' },
                { l: 'FAT', v: '-3.7%' },
                { l: 'SYMMETRY', v: '96.9%' },
              ].map((x, i) => (
                <div key={i} className="text-center">
                  <div className="mono num text-lg" style={{ color: 'var(--ac-b)' }}>
                    {x.v}
                  </div>
                  <div className="lbl mt-1" style={{ fontSize: 9 }}>
                    {x.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* THREE PILLARS */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="lbl mb-3">THREE SURFACES · ONE CONTINUITY LAYER</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 300, lineHeight: 1.05 }}>
            What Telos ships.
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-24">
        {[
          {
            num: '01',
            title: 'Member App',
            sub: 'Track between scans',
            body:
              'DEXA journey charts. Wearable + Lingo integration. Food ingredient scanner. Daily Telos chat — private to the member.',
            color: '#A0F0C8',
            ring: 'rgba(101,217,168,0.22)',
            to: '/member',
          },
          {
            num: '02',
            title: 'Coach Tools',
            sub: 'AI-prepared briefs',
            body:
              'Caseload triage. Pre-session briefs with patterns and talking points. AI-drafted member messages awaiting coach approval before send.',
            color: '#7DD3FC',
            ring: 'rgba(125,211,252,0.22)',
            to: '/coach',
          },
          {
            num: '03',
            title: 'Pattern Engine',
            sub: 'Built for Kalos data',
            body:
              "Designed to learn from Kalos's real coaching arcs and DEXA outcomes once consent and governance land. Pattern leverage for every analyst — never replacement.",
            color: '#B49AFF',
            ring: 'rgba(180,154,255,0.22)',
            to: '/data',
          },
        ].map((c, i) => (
          <Link
            key={i}
            to={c.to}
            className="glass p-8 transition-colors hover:border-[rgba(255,255,255,0.16)]"
          >
            <div
              className="mono num text-5xl mb-5"
              style={{ fontWeight: 200, color: c.color, opacity: 0.65 }}
            >
              {c.num}
            </div>
            <div className="text-lg mb-1" style={{ fontWeight: 600 }}>
              {c.title}
            </div>
            <div className="lbl mb-4" style={{ color: c.color }}>
              {c.sub}
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(245,247,250,0.66)' }}
            >
              {c.body}
            </p>
            <div
              className="mt-5 pt-4 flex items-center justify-between"
              style={{ borderTop: '1px dashed rgba(255,255,255,0.10)' }}
            >
              <span className="lbl">OPEN</span>
              <span style={{ color: c.color }}>→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* TESTIMONIALS — verbatim from livekalos.com */}
      <div className="mb-12">
        <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>DON'T TAKE OUR WORD FOR IT</div>
        <h2 className="serif text-3xl mb-6" style={{ fontWeight: 400 }}>
          Real members. Real DEXA data. <em className="italic" style={{ color: 'var(--ac-b)' }}>Real delta.</em>
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {[
            {
              q: "I feel good, I feel strong. I've gone down a couple of sizes, and even just sitting at my desk, I'm so much more comfortable than I used to be.",
              n: 'Maicie, 25',
              p: 'Wealth Management',
            },
            {
              q: "Energy is consistent, I don't need caffeine to get through 24-hour shifts anymore, and I just keep making progress.",
              n: 'Joshua, 32',
              p: 'Nurse',
            },
            {
              q: "Working out is my favorite hobby right now — and my A1C was 5.7 going into all this, now it's 4.7.",
              n: 'Jennifer, 43',
              p: 'Lab Technician',
            },
          ].map((t, i) => (
            <div key={i} className="glass p-7">
              <p className="serif italic text-lg mb-5" style={{ fontWeight: 400, lineHeight: 1.45 }}>
                "{t.q}"
              </p>
              <div className="hairline-dash pt-4">
                <div className="text-sm" style={{ fontWeight: 600 }}>{t.n}</div>
                <div className="lbl mt-1" style={{ fontSize: 9 }}>{t.p.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ANALYST POSITIONING */}
      <div className="mb-12 glass glow-cy p-10">
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-7">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>PERFORMANCE ANALYSTS · HUMAN JUDGMENT FIRST</div>
            <h2 className="serif text-3xl mb-4" style={{ fontWeight: 400, lineHeight: 1.15 }}>
              Telos gives analysts <em className="italic">leverage</em>.<br/>
              <span style={{ color: 'var(--ink-s)' }}>It never replaces them.</span>
            </h2>
            <p className="text-base mb-4" style={{ color: 'var(--ink-s)' }}>
              Kalos's promise isn't just better data — it's better interpretation. Members come for insight
              generic AI cannot provide. Telos supports that promise by preparing the analyst, surfacing
              relevant between-scan patterns, and turning daily member signals into reviewable context
              before the session begins.
            </p>
            <p className="text-base serif italic" style={{ color: 'var(--ac-b)' }}>
              Telos prepares the context. The analyst delivers the insight.
            </p>
          </div>
          <div className="col-span-5">
            <div className="space-y-3">
              {[
                { n: '6 min', l: 'DEXA SCAN' },
                { n: '20 min', l: 'ANALYST REVIEW' },
                { n: '10 min', l: 'STRATEGY SESSION' },
              ].map((x) => (
                <div
                  key={x.l}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}
                >
                  <div className="lbl" style={{ fontSize: 10 }}>{x.l}</div>
                  <div className="mono num text-2xl" style={{ color: 'var(--ac-b)', fontWeight: 500 }}>{x.n}</div>
                </div>
              ))}
            </div>
            <div className="lbl mt-3 text-center" style={{ fontSize: 9 }}>
              BETWEEN-SCAN CONTINUITY · DAILY SIGNAL, HUMAN-REVIEWED
            </div>
          </div>
        </div>
      </div>

      {/* THESIS */}
      <div className="glass p-10">
        <div className="lbl mb-6" style={{ color: '#A0F0C8' }}>
          THE COMPOUNDING THESIS
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div
            className="p-6 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="lbl mb-3">TODAY · WITHOUT TELOS</div>
            <div className="text-base mb-2" style={{ fontWeight: 500 }}>
              30-day feedback loop
            </div>
            <div className="text-sm" style={{ color: 'rgba(245,247,250,0.66)' }}>
              Scan → plan → 30 days guessing → next scan. Coach prepares from the last PDF.
              Members lose momentum in the silence.
            </div>
          </div>
          <div
            className="p-6 rounded-xl"
            style={{
              background: 'rgba(101,217,168,0.07)',
              border: '1px solid rgba(101,217,168,0.28)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div className="lbl mb-3" style={{ color: '#A0F0C8' }}>
              WITH TELOS
            </div>
            <div className="text-base mb-2" style={{ fontWeight: 500, color: '#A0F0C8' }}>
              Continuous feedback
            </div>
            <div className="text-sm" style={{ color: 'rgba(245,247,250,0.66)' }}>
              Scan → daily tracking → pattern detection → mid-cycle adjustments → next scan
              confirms. Coach walks in already prepared.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
