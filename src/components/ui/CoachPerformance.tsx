import { JAMES_KPIS, JAMES_COHORT, EXPERIMENTS, COMP_THIS_MONTH, CERTIFICATIONS, TEAM_STANDING } from '../../data/match';
import Sparkline from '../charts/Sparkline';

const trendColor: Record<string, string> = {
  up: 'var(--ac)',
  down: 'var(--warn)',
  flat: 'var(--ink-m)',
};

const statusColor: Record<string, string> = {
  'on-track': 'var(--ac)',
  flagged: 'var(--warn)',
  plateau: 'var(--ink-m)',
  new: 'var(--cy)',
};

export default function CoachPerformance() {
  return (
    <div className="space-y-8">
      {/* HEAD */}
      <div>
        <div className="lbl mb-3" style={{ color: 'var(--purple)' }}>YOUR PERFORMANCE · MAY 2026</div>
        <h2 className="serif text-3xl mb-3" style={{ fontWeight: 400 }}>
          How your members are doing — and how you stack up.
        </h2>
        <p className="text-sm max-w-2xl" style={{ color: 'var(--ink-s)' }}>
          Cohort-level outcomes for the members you analyze. Aggregated weekly. Used by Harsh + Callum at the
          Friday cohort review.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-6 gap-4">
        {JAMES_KPIS.map((k) => (
          <div key={k.label} className="glass p-5">
            <div className="lbl mb-3" style={{ fontSize: 9 }}>{k.label}</div>
            <div className="mono num text-3xl mb-1" style={{ color: trendColor[k.trend], fontWeight: 500 }}>
              {k.value}
            </div>
            <div className="text-[10px] mono mb-2" style={{ color: trendColor[k.trend] }}>{k.delta}</div>
            <div className="lbl" style={{ fontSize: 8 }}>{k.detail.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* COHORT TABLE + EXPERIMENT LOG */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="glass p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="lbl mb-1" style={{ color: 'var(--ac-b)' }}>YOUR ROSTER · 6 ACTIVE</div>
                <div className="serif text-2xl" style={{ fontWeight: 400 }}>Cohort outcomes</div>
              </div>
              <span className="chip chip-ac">5 ON-TRACK · 1 FLAGGED</span>
            </div>
            <div className="space-y-2">
              {JAMES_COHORT.map((m) => (
                <div
                  key={m.name}
                  className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div
                      className="rounded-lg flex items-center justify-center serif"
                      style={{
                        width: 36,
                        height: 36,
                        fontSize: 14,
                        background: 'color-mix(in srgb, var(--ac) 12%, transparent)',
                        color: 'var(--ac-b)',
                        border: '1px solid color-mix(in srgb, var(--ac) 28%, transparent)',
                      }}
                    >
                      {m.init}
                    </div>
                    <div>
                      <div className="text-sm" style={{ fontWeight: 500 }}>{m.name}</div>
                      <div className="lbl mt-0.5" style={{ fontSize: 9 }}>
                        {m.weeks === 0 ? 'INTAKE TODAY' : `${m.weeks} WEEKS`}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="lbl" style={{ fontSize: 9 }}>FAT Δ</div>
                    <div className="mono num text-sm" style={{ color: m.fatΔ === 'baseline' ? 'var(--ink-m)' : 'var(--ac)' }}>{m.fatΔ}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="lbl" style={{ fontSize: 9 }}>LEAN Δ</div>
                    <div className="mono num text-sm" style={{ color: m.leanΔ === 'baseline' ? 'var(--ink-m)' : 'var(--ac)' }}>{m.leanΔ}</div>
                  </div>
                  <div className="col-span-3">
                    <div className="lbl mb-1" style={{ fontSize: 9 }}>ADHERENCE</div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
                      <div
                        style={{
                          width: `${m.adherence}%`,
                          height: '100%',
                          background:
                            m.adherence > 85
                              ? 'linear-gradient(90deg, var(--ac), var(--ac-b))'
                              : m.adherence > 60
                              ? 'linear-gradient(90deg, var(--warn), #FFD9A0)'
                              : 'var(--ink-m)',
                          borderRadius: 999,
                        }}
                      />
                    </div>
                    <div className="mono num text-[10px] mt-1" style={{ color: 'var(--ink-s)' }}>{m.adherence}%</div>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className="dot" style={{ background: statusColor[m.status], boxShadow: `0 0 8px ${statusColor[m.status]}` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TEAM STANDING + CERTS */}
        <div className="col-span-4 space-y-6">
          <div className="glass glow-cy p-6">
            <div className="lbl mb-3" style={{ color: 'var(--cy)' }}>TEAM STANDING</div>
            <div className="flex items-baseline gap-2 mb-2">
              <div className="mono num text-4xl" style={{ fontWeight: 300 }}>#{TEAM_STANDING.rank}</div>
              <div className="text-base" style={{ color: 'var(--ink-s)' }}>of {TEAM_STANDING.total} analysts</div>
            </div>
            <div className="lbl mb-2" style={{ fontSize: 9 }}>{TEAM_STANDING.category.toUpperCase()}</div>
            <p className="text-xs" style={{ color: 'var(--ink-s)' }}>{TEAM_STANDING.detail}</p>
          </div>

          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>COHORT FAT-LOSS · 6 WEEKS</div>
            <Sparkline
              values={[1.0, 1.1, 1.2, 1.3, 1.35, 1.4]}
              color="var(--ac)"
              height={70}
            />
            <div className="text-xs mt-2" style={{ color: 'var(--ink-s)' }}>
              Avg % fat lost across your cohort, week over week. Trending up.
            </div>
          </div>

          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>CERTIFICATIONS</div>
            <div className="space-y-2">
              {CERTIFICATIONS.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div>
                    <div className="text-xs" style={{ fontWeight: 500 }}>{c.name}</div>
                    <div className="lbl mt-0.5" style={{ fontSize: 9 }}>{c.expires.toUpperCase()}</div>
                  </div>
                  <span
                    className={
                      'chip ' + (c.status === 'current' ? 'chip-ac' : c.status === 'in-progress' ? 'chip-cy' : 'chip-warn')
                    }
                    style={{ fontSize: 9 }}
                  >
                    {c.status === 'current' ? 'CURRENT' : c.status === 'in-progress' ? 'IN-PROG' : 'RENEW'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EXPERIMENT LOG */}
      <div>
        <div className="lbl mb-3" style={{ color: 'var(--purple)' }}>YOUR EXPERIMENT LOG</div>
        <h3 className="serif text-2xl mb-3" style={{ fontWeight: 400 }}>
          Protocols you've tested — and their cohort-level results.
        </h3>
        <p className="text-sm mb-5 max-w-2xl" style={{ color: 'var(--ink-s)' }}>
          Single-variable tests across your roster. Feeds back into the Standards library when results hit
          high-confidence. Harsh's framing — "every coach is a data scientist."
        </p>
        <div className="grid grid-cols-2 gap-5">
          {EXPERIMENTS.map((e) => (
            <div key={e.id} className="glass p-6">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={
                    'chip ' + (e.conf === 'high' ? 'chip-ac' : e.conf === 'med' ? 'chip-cy' : 'chip-pur')
                  }
                >
                  {e.conf.toUpperCase()} · n={e.cohortSize}
                </span>
                <span className="lbl" style={{ fontSize: 9 }}>{e.duration.toUpperCase()}</span>
              </div>
              <div className="text-base mb-2" style={{ fontWeight: 500 }}>{e.protocol}</div>
              <div className="text-sm" style={{ color: 'var(--ink-s)' }}>{e.result}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COMP TRACKER — structure only, no synthetic dollar values */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="glass p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="lbl mb-1" style={{ color: 'var(--ac-b)' }}>COMPENSATION · MAY</div>
                <div className="serif text-2xl" style={{ fontWeight: 400 }}>This month's payout</div>
              </div>
              <span className="chip chip-ac">PAYOUT {COMP_THIS_MONTH.nextPayout.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { l: 'BASE', v: '$ —', s: 'Monthly · loaded from payroll' },
                { l: 'COMMISSION', v: '$ —', s: `${COMP_THIS_MONTH.signups} signups · ${COMP_THIS_MONTH.retentions} retentions this mo` },
                { l: 'TOTAL', v: '$ —', s: 'May earned' },
                { l: 'YTD', v: '$ —', s: 'Year to date' },
              ].map((x) => (
                <div key={x.l} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
                  <div className="lbl mb-2" style={{ fontSize: 9 }}>{x.l}</div>
                  <div className="mono num text-2xl" style={{ fontWeight: 300, color: 'var(--ink-m)' }}>{x.v}</div>
                  <div className="lbl mt-1" style={{ fontSize: 9 }}>{x.s}</div>
                </div>
              ))}
            </div>
            <div className="lbl mt-4" style={{ fontSize: 9 }}>
              DEMO · ACTUAL DOLLAR VALUES POPULATE FROM KALOS PAYROLL INTEGRATION
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="glass p-6">
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>AVAILABILITY · NEXT 14 DAYS</div>
            <div className="space-y-2 mb-4">
              {[
                { d: 'May 12', booked: 6, cap: 8 },
                { d: 'May 13', booked: 7, cap: 8 },
                { d: 'May 14', booked: 4, cap: 8 },
                { d: 'May 15', booked: 5, cap: 8 },
                { d: 'May 16', booked: 0, cap: 0 },
              ].map((d) => (
                <div key={d.d} className="flex items-center gap-3">
                  <div className="lbl" style={{ width: 64, fontSize: 9 }}>{d.d.toUpperCase()}</div>
                  <div className="flex-1" style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
                    <div
                      style={{
                        width: d.cap > 0 ? `${(d.booked / d.cap) * 100}%` : '0%',
                        height: '100%',
                        background: d.cap === 0 ? 'var(--ink-m)' : d.booked / d.cap > 0.85 ? 'linear-gradient(90deg, var(--warn), #FFD9A0)' : 'linear-gradient(90deg, var(--ac), var(--ac-b))',
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <div className="mono num text-xs" style={{ color: 'var(--ink-s)', minWidth: 36, textAlign: 'right' }}>
                    {d.cap === 0 ? 'OFF' : `${d.booked}/${d.cap}`}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-gh" style={{ width: '100%' }}>Request time off</button>
          </div>
        </div>
      </div>
    </div>
  );
}
