import { useMemo, useState } from 'react';
import { coachInsight, memoryRecords, patterns, syntheticMember } from '../data/cama';
import type { MemoryType, Pattern } from '../types/cama';

const TYPE_COLOR: Record<MemoryType, string> = {
  dexa_summary: '#7DD3FC',
  coach_note: '#A0F0C8',
  food_log: '#FFD08A',
  checkin: '#B49AFF',
  goal: '#FF9988',
  setback: '#FF7A8A',
  preference: '#9FE9D6',
};

const SIGNAL_COLOR: Record<Pattern['signal'], string> = {
  supportive: '#A0F0C8',
  cautionary: '#FFB088',
  reinforcing: '#7DD3FC',
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function CamaProof() {
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);

  const highlightedMemoryIds = useMemo(() => {
    if (!selectedPatternId) return new Set<string>();
    const p = patterns.find((x) => x.id === selectedPatternId);
    return new Set(p?.derivedFrom ?? []);
  }, [selectedPatternId]);

  const sortedMemories = useMemo(
    () => [...memoryRecords].sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    [],
  );

  const insightPatterns = patterns.filter((p) => coachInsight.patternIds.includes(p.id));

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-16">
      {/* HERO */}
      <div className="mb-10">
        <div className="lbl mb-5" style={{ color: '#B49AFF' }}>
          CAMA · PROOF LAYER · PROVENANCE-AUDITABLE
        </div>
        <h1
          style={{
            fontSize: 'clamp(2.6rem,4.6vw,4.2rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.03em',
            fontWeight: 300,
          }}
        >
          Insight, with{' '}
          <em className="serif italic" style={{ fontWeight: 400, color: '#B49AFF' }}>
            receipts.
          </em>
        </h1>
        <p className="mt-4 text-base max-w-2xl" style={{ color: 'rgba(245,247,250,0.66)' }}>
          Every coach-facing insight traces to the patterns that produced it, and every pattern
          traces to the underlying memory records. No claim is opaque. Click any pattern to see
          exactly which memories CAMA associated to derive it.
        </p>
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <span className="chip chip-priv">SYNTHETIC DATA</span>
          <span className="chip chip-cy">{syntheticMember.scanCount} DEXA SCANS · {syntheticMember.monthsActive} MONTHS</span>
          <span className="text-xs" style={{ color: 'rgba(245,247,250,0.50)' }}>
            Member · {syntheticMember.name} · M-MAYA · No Kalos data used
          </span>
        </div>
      </div>

      {/* COACH INSIGHT */}
      <div className="glass p-10 mb-12" data-testid="coach-insight">
        <div className="flex items-center justify-between mb-5">
          <div className="lbl" style={{ color: '#B49AFF' }}>
            COACH INSIGHT · BEFORE NEXT SESSION
          </div>
          <span className="chip chip-ac">DERIVED FROM {insightPatterns.length} PATTERNS</span>
        </div>
        <div
          className="serif text-3xl mb-4"
          style={{ fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)' }}
        >
          {coachInsight.headline}
        </div>
        <p
          className="text-base mb-5"
          style={{ color: 'rgba(245,247,250,0.78)', lineHeight: 1.55 }}
        >
          {coachInsight.body}
        </p>
        <div
          className="rounded-xl p-5"
          style={{
            background: 'rgba(180,154,255,0.06)',
            border: '1px solid rgba(180,154,255,0.18)',
          }}
        >
          <div className="lbl mb-2" style={{ color: '#B49AFF' }}>
            SUGGESTED FOLLOWUP
          </div>
          <p className="text-sm" style={{ color: 'rgba(245,247,250,0.84)', lineHeight: 1.55 }}>
            {coachInsight.suggestedFollowup}
          </p>
        </div>
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <span className="lbl mr-2" style={{ color: 'rgba(245,247,250,0.50)' }}>
            PROVENANCE
          </span>
          {insightPatterns.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() =>
                setSelectedPatternId((prev) => (prev === p.id ? null : p.id))
              }
              className="text-xs px-3 py-1 rounded-full transition-colors"
              style={{
                background:
                  selectedPatternId === p.id
                    ? `color-mix(in srgb, ${SIGNAL_COLOR[p.signal]} 22%, transparent)`
                    : 'rgba(255,255,255,0.04)',
                border: `1px solid ${
                  selectedPatternId === p.id
                    ? SIGNAL_COLOR[p.signal]
                    : 'rgba(255,255,255,0.10)'
                }`,
                color:
                  selectedPatternId === p.id ? SIGNAL_COLOR[p.signal] : 'rgba(245,247,250,0.78)',
              }}
            >
              {p.id}
            </button>
          ))}
        </div>
      </div>

      {/* PATTERNS */}
      <div className="mb-6 flex items-center justify-between">
        <div className="lbl" style={{ color: '#B49AFF' }}>
          DERIVED PATTERNS · CLICK TO TRACE
        </div>
        {selectedPatternId && (
          <button
            type="button"
            onClick={() => setSelectedPatternId(null)}
            className="text-xs"
            style={{ color: 'rgba(245,247,250,0.60)' }}
          >
            clear selection
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-6 mb-12">
        {patterns.map((p) => {
          const active = selectedPatternId === p.id;
          const color = SIGNAL_COLOR[p.signal];
          return (
            <button
              key={p.id}
              type="button"
              onClick={() =>
                setSelectedPatternId((prev) => (prev === p.id ? null : p.id))
              }
              className="glass p-7 text-left transition-transform"
              data-testid={`pattern-${p.id}`}
              style={{
                cursor: 'pointer',
                outline: active ? `2px solid ${color}` : '2px solid transparent',
                outlineOffset: '-1px',
                transform: active ? 'translateY(-2px)' : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="lbl" style={{ color }}>
                  {p.signal.toUpperCase()}
                </div>
                <span className="mono text-xs" style={{ color: 'rgba(245,247,250,0.45)' }}>
                  {p.id}
                </span>
              </div>
              <p
                className="text-sm mb-4"
                style={{ color: 'rgba(245,247,250,0.84)', lineHeight: 1.55 }}
              >
                {p.summary}
              </p>
              <div className="text-xs" style={{ color: 'rgba(245,247,250,0.50)' }}>
                Derived from {p.derivedFrom.length} memory records
              </div>
            </button>
          );
        })}
      </div>

      {/* MEMORY TIMELINE */}
      <div className="mb-6 flex items-center justify-between">
        <div className="lbl" style={{ color: '#B49AFF' }}>
          MEMORY TIMELINE · {sortedMemories.length} RECORDS
        </div>
        {selectedPatternId && (
          <div className="text-xs" style={{ color: 'rgba(245,247,250,0.66)' }}>
            highlighting {highlightedMemoryIds.size} memories tied to {selectedPatternId}
          </div>
        )}
      </div>
      <div className="space-y-3">
        {sortedMemories.map((m) => {
          const highlighted = highlightedMemoryIds.has(m.id);
          const dimmed = selectedPatternId !== null && !highlighted;
          const color = TYPE_COLOR[m.memoryType];
          return (
            <div
              key={m.id}
              className="glass p-5 transition-opacity"
              data-testid={`memory-${m.id}`}
              data-highlighted={highlighted ? 'true' : 'false'}
              style={{
                opacity: dimmed ? 0.35 : 1,
                outline: highlighted ? `2px solid ${color}` : '2px solid transparent',
                outlineOffset: '-1px',
              }}
            >
              <div className="grid grid-cols-12 gap-5 items-start">
                <div className="col-span-2">
                  <div
                    className="mono text-xs mb-1"
                    style={{ color: 'rgba(245,247,250,0.50)' }}
                  >
                    {fmtDate(m.timestamp)}
                  </div>
                  <div className="mono text-[10px]" style={{ color: 'rgba(245,247,250,0.35)' }}>
                    {m.id}
                  </div>
                </div>
                <div className="col-span-2">
                  <span
                    className="text-[10px] px-2 py-1 rounded-full uppercase tracking-wider"
                    style={{
                      background: `color-mix(in srgb, ${color} 14%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
                      color,
                      fontWeight: 600,
                    }}
                  >
                    {m.memoryType.replace('_', ' ')}
                  </span>
                  <div
                    className="mt-2 text-[10px] uppercase tracking-wider"
                    style={{ color: 'rgba(245,247,250,0.45)' }}
                  >
                    {m.durability}
                  </div>
                </div>
                <div className="col-span-6">
                  <p
                    className="text-sm mb-2"
                    style={{ color: 'rgba(245,247,250,0.86)', lineHeight: 1.5 }}
                  >
                    {m.content}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] mono px-1.5 py-0.5 rounded"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          color: 'rgba(245,247,250,0.60)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <div
                    className="mono text-xs"
                    style={{ color: 'rgba(245,247,250,0.60)' }}
                  >
                    conf {m.confidence.toFixed(2)}
                  </div>
                  <div
                    className="text-[10px] mt-1"
                    style={{ color: 'rgba(245,247,250,0.40)' }}
                  >
                    {m.source}
                  </div>
                  <div
                    className="text-[10px] mt-1"
                    style={{ color: 'rgba(245,247,250,0.35)' }}
                  >
                    {m.provenance}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ARCHITECTURE NOTE */}
      <div
        className="mt-14 glass p-8"
        style={{ background: 'rgba(180,154,255,0.04)', borderColor: 'rgba(180,154,255,0.18)' }}
      >
        <div className="lbl mb-3" style={{ color: '#B49AFF' }}>
          ARCHITECTURE NOTE
        </div>
        <p className="text-sm mb-3" style={{ color: 'rgba(245,247,250,0.84)', lineHeight: 1.6 }}>
          This proof layer demonstrates how approved coaching and body-composition data could be
          converted into persistent memory records, retrieved across time, and surfaced as
          coach-support insights — with every claim auditable down to the source memory.
        </p>
        <p className="text-sm" style={{ color: 'rgba(245,247,250,0.66)', lineHeight: 1.6 }}>
          No Kalos private data was used. Data ingestion, consent, governance, and security review
          are prerequisites to applying the same architecture to real coaching workflows. See{' '}
          <span className="mono">BUILD_PLAN.md</span> for the production rollout sequence.
        </p>
      </div>
    </div>
  );
}
