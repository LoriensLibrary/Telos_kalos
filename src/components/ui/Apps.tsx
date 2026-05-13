import { CONNECTED_APPS } from '../../data/schedule';

const statusMeta = {
  live: { chip: 'chip-ac', label: 'LIVE', dot: 'dot-ac' },
  paused: { chip: 'chip-warn', label: 'PAUSED', dot: 'dot-warn' },
  available: { chip: 'chip-cy', label: 'ROADMAP', dot: 'dot-cy' },
};

export default function Apps() {
  const live = CONNECTED_APPS.filter((a) => a.status === 'live');
  const paused = CONNECTED_APPS.filter((a) => a.status === 'paused');
  const available = CONNECTED_APPS.filter((a) => a.status === 'available');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>2 LIVE · 7 ON ROADMAP</div>
          <h2 className="serif text-3xl mb-3" style={{ fontWeight: 400 }}>
            What plugs in today — and what's coming.
          </h2>
          <p className="text-sm" style={{ color: 'var(--ink-s)' }}>
            Telos ships with the Kalos photo food log and weight log live. Wearable and CGM integrations
            are queued for the next four quarters — Apple Health and Whoop first.
          </p>
        </div>
        <div className="col-span-4">
          <div className="glass p-5 glow-cy">
            <div className="lbl mb-2" style={{ color: 'var(--cy)' }}>SYNC STATUS</div>
            <div className="flex items-center gap-3">
              <span className="dot dot-cy pulse" />
              <div className="text-sm">Photo food log + weight log syncing in real time.</div>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE */}
      <div>
        <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>LIVE TODAY</div>
        <div className="grid grid-cols-3 gap-5">
          {live.map((a) => <AppCard key={a.name} a={a} />)}
        </div>
      </div>

      {/* PAUSED */}
      {paused.length > 0 && (
        <div>
          <div className="lbl mb-4" style={{ color: 'var(--warn)' }}>PAUSED</div>
          <div className="grid grid-cols-3 gap-5">
            {paused.map((a) => <AppCard key={a.name} a={a} />)}
          </div>
        </div>
      )}

      {/* ROADMAP */}
      <div>
        <div className="lbl mb-4" style={{ color: 'var(--cy)' }}>ON THE ROADMAP</div>
        <div className="grid grid-cols-3 gap-5">
          {available.map((a) => <AppCard key={a.name} a={a} />)}
        </div>
      </div>
    </div>
  );
}

function AppCard({ a }: { a: typeof CONNECTED_APPS[number] }) {
  const meta = statusMeta[a.status];
  return (
    <div className="glass p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-base mb-1" style={{ fontWeight: 600 }}>{a.name}</div>
          <div className="lbl" style={{ fontSize: 9 }}>{a.category.toUpperCase()}</div>
        </div>
        <span className={`chip ${meta.chip}`}>
          <span className={`dot ${meta.dot}`} />
          {meta.label}
        </span>
      </div>
      <p className="text-xs mb-4" style={{ color: 'var(--ink-s)' }}>{a.desc}</p>
      <div className="lbl mb-2" style={{ fontSize: 9 }}>METRICS</div>
      <div className="flex flex-wrap gap-1 mb-4">
        {a.metrics.map((m) => (
          <span key={m} className="chip" style={{ fontSize: 9 }}>{m}</span>
        ))}
      </div>
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px dashed var(--line-s)' }}
      >
        <div className="lbl" style={{ fontSize: 9 }}>
          {a.status === 'live' ? 'LAST SYNC · ' : 'STATUS · '}{a.lastSync.toUpperCase()}
        </div>
        {a.status === 'live' ? (
          <button className="btn-gh" style={{ padding: '6px 10px', fontSize: 10 }}>Manage</button>
        ) : a.status === 'paused' ? (
          <button className="btn-ac" style={{ padding: '6px 10px', fontSize: 10 }}>Resume</button>
        ) : (
          <button className="btn-gh" style={{ padding: '6px 10px', fontSize: 10 }}>Notify me</button>
        )}
      </div>
    </div>
  );
}
