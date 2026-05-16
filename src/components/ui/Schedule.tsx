import { MEMBER_SCHEDULE } from '../../data/schedule';

const typeMeta: Record<string, { color: string; chip: string; lbl: string }> = {
  scan: { color: 'var(--ac)', chip: 'chip-ac', lbl: 'DEXA SCAN' },
  analyst: { color: 'var(--cy)', chip: 'chip-cy', lbl: 'ANALYST SESSION' },
  recovery: { color: 'var(--purple)', chip: 'chip-pur', lbl: 'RECOVERY' },
  class: { color: 'var(--ac-b)', chip: 'chip-ac', lbl: 'TRAINING' },
  intake: { color: 'var(--warn)', chip: 'chip-warn', lbl: 'INTAKE' },
};

export default function Schedule() {
  // Group by date
  const groups = MEMBER_SCHEDULE.reduce<Record<string, typeof MEMBER_SCHEDULE>>((acc, s) => {
    (acc[s.date] = acc[s.date] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 space-y-6">
        <div className="glass p-7">
          <div className="flex items-center justify-between mb-2">
            <div className="lbl" style={{ color: 'var(--ac-b)' }}>YOUR WEEK · MAY 12–19</div>
            <span className="chip chip-cy">
              <span className="dot dot-cy pulse" />
              6 BOOKED · 1 OPEN SLOT
            </span>
          </div>
          <h2 className="serif text-3xl mb-2" style={{ fontWeight: 400 }}>
            Everything Maya has on the calendar.
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ink-s)' }}>
            Analyst sessions, the next DEXA, recovery suite, and training sit in one place. Add or move anything from
            here.
          </p>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <button className="btn-ac">+ Book a session</button>
            <button className="btn-gh">Sync to Apple Calendar</button>
            <button className="btn-gh">Sync to Google</button>
          </div>

          <div className="space-y-5">
            {Object.entries(groups).map(([date, sessions]) => (
              <div key={date}>
                <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>{date}</div>
                <div className="space-y-3">
                  {sessions.map((s) => {
                    const meta = typeMeta[s.type];
                    return (
                      <div
                        key={s.id}
                        className="flex items-stretch gap-4 p-4 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}
                      >
                        <div style={{ width: 64, flexShrink: 0 }}>
                          <div className="mono num text-base" style={{ fontWeight: 500 }}>{s.time}</div>
                          <div className="lbl mt-1" style={{ fontSize: 9 }}>{s.duration}</div>
                        </div>
                        <div style={{ width: 1, background: meta.color, opacity: 0.4 }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <div className="text-base" style={{ fontWeight: 500 }}>{s.title}</div>
                            <span className={`chip ${meta.chip}`}>{meta.lbl}</span>
                          </div>
                          <div className="text-sm mb-1" style={{ color: 'var(--ink-s)' }}>{s.detail}</div>
                          <div className="lbl" style={{ fontSize: 9 }}>{s.location}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {s.prepUrl && <button className="btn-gh" style={{ padding: '6px 10px', fontSize: 10 }}>Prep brief</button>}
                          <button className="btn-gh" style={{ padding: '6px 10px', fontSize: 10 }}>Move</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-4 space-y-6">
        <div className="glass p-6 glow">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>NEXT UP</div>
          <div className="mono num text-3xl mb-1">21h</div>
          <div className="text-sm mb-2" style={{ color: 'var(--ink-s)' }}>Tue · May 12 · 09:00</div>
          <div className="text-base mb-4" style={{ fontWeight: 500 }}>Analyst session · Analyst 2</div>
          <p className="text-xs mb-4" style={{ color: 'var(--ink-s)' }}>
            DEXA #6 review · scan #7 prep · adjustment to the minimum-effective block through 5/13.
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-ac">View prep brief</button>
            <button className="btn-gh">Reschedule</button>
          </div>
        </div>

        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>BOOK MORE</div>
          <p className="text-xs mb-4" style={{ color: 'var(--ink-s)' }}>Add to your week.</p>
          <div className="space-y-2">
            {[
              { d: 'Thu · May 14', t: '10:00', n: 'Async analyst check-in', loc: 'Telos app' },
              { d: 'Fri · May 15', t: '15:30', n: 'DEXA add-on scan', loc: 'SF studio' },
              { d: 'Sat · May 16', t: '11:00', n: 'Nutrition deep-dive', loc: 'Telos app' },
              { d: 'Mon · May 18', t: '09:00', n: 'Program review · 30m', loc: 'Telos app' },
            ].map((s, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)', cursor: 'pointer' }}
              >
                <div className="mono num text-sm" style={{ width: 60 }}>{s.t}</div>
                <div className="flex-1">
                  <div className="text-xs" style={{ fontWeight: 500 }}>{s.n}</div>
                  <div className="lbl mt-0.5" style={{ fontSize: 9 }}>{s.d} · {s.loc}</div>
                </div>
                <span className="mono" style={{ color: 'var(--ac-b)', fontSize: 14 }}>+</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>YOUR ACCESS</div>
          <p className="text-sm" style={{ color: 'var(--ink-s)' }}>
            24/7 app + analyst access. In-person DEXA scans by appointment at SF, Palo Alto, or Campbell.
          </p>
          <div className="lbl mt-4 mb-2">PRIMARY STUDIO</div>
          <div className="text-sm">San Francisco · 98a Battery St</div>
        </div>
      </div>
    </div>
  );
}
