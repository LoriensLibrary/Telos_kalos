import { PROTOCOLS } from '../../data/day';

export default function StandardsView() {
  return (
    <div>
      <div className="mb-6">
        <div className="lbl mb-3" style={{ color: 'var(--purple)' }}>KALOS STANDARDS · PROTOCOL LIBRARY</div>
        <h2 style={{ fontSize: 'clamp(1.6rem,2.5vw,2rem)', fontWeight: 300, lineHeight: 1.05 }}>
          The house playbook.
        </h2>
        <p className="mt-2 text-sm max-w-xl" style={{ color: 'var(--ink-s)' }}>
          Versioned protocols Telos uses to draft briefs and suggest adjustments. Edited by the founders quarterly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {PROTOCOLS.map((p) => (
          <div key={p.code} className="glass p-7">
            <div className="flex items-center justify-between mb-3">
              <span className="chip chip-pur">{p.code}</span>
              <span className="chip">{p.matches} ACTIVE MATCHES</span>
            </div>
            <div className="serif text-xl mb-3" style={{ fontWeight: 400 }}>{p.title}</div>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-s)' }}>{p.body}</p>
            <div className="lbl pt-3" style={{ borderTop: '1px dashed var(--line-s)', fontSize: 9 }}>
              CITATIONS · {p.citations}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
