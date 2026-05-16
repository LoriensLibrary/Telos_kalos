import { useState } from 'react';
import { TODAY_SCHEDULE, type Session } from '../../data/day';

export default function DayView() {
  const [openId, setOpenId] = useState<string | null>('s1');
  const open = TODAY_SCHEDULE.find((s) => s.id === openId);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT — SCHEDULE TIMELINE */}
      <div className="col-span-5">
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="lbl" style={{ color: 'var(--ac-b)' }}>SCHEDULE · WEDNESDAY MAY 13</div>
            <span className="chip chip-ac">AI-PREPARED</span>
          </div>
          <div className="space-y-2">
            {TODAY_SCHEDULE.map((s) => (
              <ScheduleBlock key={s.id} s={s} active={openId === s.id} onClick={() => setOpenId(s.id)} />
            ))}
          </div>
          <div className="hairline-dash mt-5 pt-4">
            <div className="lbl mb-2">DAY STATS</div>
            <div className="grid grid-cols-3 gap-3">
              <div><div className="lbl" style={{ fontSize: 9 }}>SESSIONS</div><div className="mono num text-lg">6</div></div>
              <div><div className="lbl" style={{ fontSize: 9 }}>SCANS REV.</div><div className="mono num text-lg">2</div></div>
              <div><div className="lbl" style={{ fontSize: 9 }}>NEW INTAKE</div><div className="mono num text-lg">1</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — SESSION DETAIL */}
      <div className="col-span-7">
        {open ? <SessionDetail s={open} /> : <EmptyDetail />}
      </div>
    </div>
  );
}

function ScheduleBlock({ s, active, onClick }: { s: Session; active: boolean; onClick: () => void }) {
  const isBlock = s.status === 'block';
  const isDone = s.status === 'done';
  const isNow = s.status === 'now';
  const c = isNow ? 'var(--ac)' : isDone ? 'var(--ink-m)' : isBlock ? 'var(--ink-m)' : 'var(--cy)';

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-stretch gap-3 p-3 rounded-xl transition-all"
      style={{
        background: active ? 'color-mix(in srgb, var(--ac) 8%, transparent)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${active ? 'color-mix(in srgb, var(--ac) 32%, transparent)' : 'var(--line)'}`,
        boxShadow: active ? 'inset 0 0 0 1px color-mix(in srgb, var(--ac) 20%, transparent)' : 'none',
        opacity: isDone ? 0.55 : 1,
        cursor: 'pointer',
      }}
    >
      <div className="text-center" style={{ width: 56, flexShrink: 0 }}>
        <div className="mono num text-sm">{s.time}</div>
        <div className="lbl" style={{ fontSize: 8, marginTop: 2 }}>{s.duration}</div>
      </div>
      <div style={{ width: 1, background: c, opacity: 0.4, alignSelf: 'stretch' }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {!isBlock && (
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center serif text-sm flex-shrink-0"
              style={{
                background: 'color-mix(in srgb, var(--ac) 12%, transparent)',
                color: 'var(--ac-b)',
                border: '1px solid color-mix(in srgb, var(--ac) 28%, transparent)',
              }}
            >
              {s.init}
            </div>
          )}
          <div className="text-sm truncate" style={{ fontWeight: 500, color: isBlock ? 'var(--ink-s)' : 'var(--ink)' }}>
            {s.member}
          </div>
          {s.flags?.includes('flagged') && <span className="dot dot-warn" />}
          {isNow && <span className="chip chip-ac"><span className="dot dot-ac pulse" /> NOW</span>}
        </div>
        <div className="lbl truncate" style={{ fontSize: 9 }}>{s.type}</div>
      </div>
    </button>
  );
}

function EmptyDetail() {
  return (
    <div className="glass p-10 text-center" style={{ minHeight: 400 }}>
      <div className="lbl">SELECT A SESSION</div>
      <p className="text-sm mt-2" style={{ color: 'var(--ink-s)' }}>Pick a time block to load the AI brief.</p>
    </div>
  );
}

function SessionDetail({ s }: { s: Session }) {
  // Hooks must run unconditionally on every render — call before any early return.
  const [notes, setNotes] = useState(s.notes ?? '');
  const isBlock = s.status === 'block';

  if (isBlock) {
    return (
      <div className="glass p-7">
        <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>{s.time}–{s.end} · {s.duration}</div>
        <h3 className="serif text-2xl mb-3" style={{ fontWeight: 400 }}>{s.member}</h3>
        <p className="text-sm" style={{ color: 'var(--ink-s)' }}>{s.type}</p>
        {s.brief && (
          <ul className="mt-4 space-y-2">
            {s.brief.map((b, i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--ink-s)' }}>
                <span className="mono" style={{ color: 'var(--ac)' }}>{String(i + 1).padStart(2, '0')}</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="glass glow p-7">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center serif text-lg"
              style={{
                background: 'color-mix(in srgb, var(--ac) 14%, transparent)',
                color: 'var(--ac-b)',
                border: '1px solid color-mix(in srgb, var(--ac) 30%, transparent)',
              }}
            >
              {s.init}
            </div>
            <div>
              <div className="text-xl" style={{ fontWeight: 600 }}>{s.member}</div>
              <div className="lbl mt-1">{s.time}–{s.end} · {s.type}</div>
            </div>
          </div>
          {s.flags?.includes('flagged') && (
            <span className="chip chip-warn"><span className="dot dot-warn pulse" /> FLAGGED · HIGH-LOAD</span>
          )}
        </div>

        {s.protocol && (
          <div className="mb-5 p-3 rounded-lg" style={{ background: 'color-mix(in srgb, var(--cy) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--cy) 22%, transparent)' }}>
            <div className="lbl mb-1" style={{ color: 'var(--cy)' }}>PROTOCOL</div>
            <div className="text-sm">{s.protocol}</div>
          </div>
        )}

        {s.brief && (
          <>
            <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>AI BRIEF · ANALYST PRE-READ</div>
            <div className="space-y-2 mb-5">
              {s.brief.map((b, i) => (
                <div key={i} className="text-sm leading-relaxed flex items-start gap-3" style={{ color: 'var(--ink-s)' }}>
                  <span className="mono num text-xs" style={{ color: 'var(--ac)', marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="glass p-7">
        <div className="flex items-center justify-between mb-3">
          <div className="lbl" style={{ color: 'var(--ac-b)' }}>SESSION NOTES</div>
          <div className="flex items-center gap-2">
            <span className="chip">AUTOSAVED</span>
          </div>
        </div>
        <textarea
          className="input"
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes during or after the session…"
          style={{ resize: 'vertical', fontFamily: 'inherit' }}
        />
        <div className="lbl mt-2" style={{ fontSize: 9 }}>VOICE-DICTATION READY · WHISPER ON-DEVICE</div>
      </div>

      <div className="glass p-7">
        <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>AI-SUGGESTED ACTIONS</div>
        <div className="space-y-2">
          {[
            { a: 'Send minimum-effective program template', conf: 'high' },
            { a: 'Schedule mid-cycle check-in May 16', conf: 'med' },
            { a: 'Flag for cohort review next Friday', conf: 'low' },
          ].map((x, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
              <div className="flex-1 text-sm">{x.a}</div>
              <span className={`chip ${x.conf === 'high' ? 'chip-ac' : 'chip'}`}>{x.conf.toUpperCase()}</span>
              <button className="btn-gh" style={{ padding: '6px 10px', fontSize: 10 }}>Queue</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
