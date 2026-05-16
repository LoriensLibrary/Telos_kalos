import { useState } from 'react';
import { CLIENTS, CASELOAD } from '../../data/clients';
import DEXAChart from '../../components/charts/DEXAChart';
import { STATUS_FILTER } from './shared';

export default function CaseloadView({ onOpen }: { onOpen: (id: string) => void }) {
  const [filter, setFilter] = useState<string | null>(null);

  const visibleClients = filter
    ? CLIENTS.filter((c) => c.status === STATUS_FILTER[filter])
    : CLIENTS;

  const filterMeta = filter ? CASELOAD.find((c) => c.label === filter) : null;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {CASELOAD.map((x, i) => {
          const active = filter === x.label;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setFilter(active ? null : x.label)}
              className="glass p-5 text-center transition-all"
              data-testid={`caseload-filter-${x.label.replace(/\s+/g, '-').toLowerCase()}`}
              aria-pressed={active}
              style={{
                cursor: 'pointer',
                outline: active ? `2px solid ${x.color}` : '2px solid transparent',
                outlineOffset: '-1px',
                transform: active ? 'translateY(-2px)' : 'none',
                boxShadow: active
                  ? `0 8px 32px color-mix(in srgb, ${x.color} 22%, transparent)`
                  : 'none',
              }}
            >
              <div className="mono text-4xl num mb-2" style={{ fontWeight: 200, color: x.color }}>{x.val}</div>
              <div className="lbl" style={{ color: x.color }}>{x.label}</div>
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="lbl" style={{ color: 'var(--ac-b)' }}>
          {filter
            ? `${filter.toUpperCase()} · YOUR ROSTER`
            : 'YOUR MEMBERS · CLICK A STATUS ABOVE TO FILTER'}
        </div>
        {filter && (
          <button
            type="button"
            onClick={() => setFilter(null)}
            className="text-xs"
            style={{
              color: 'rgba(245,247,250,0.60)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            clear filter
          </button>
        )}
      </div>

      {visibleClients.length === 0 ? (
        <div className="glass p-10 text-center" data-testid="caseload-empty">
          <div className="lbl mb-2">NONE IN YOUR ROSTER</div>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--ink-s)' }}>
            {filterMeta?.val ?? 0} member{(filterMeta?.val ?? 0) === 1 ? '' : 's'} {filter?.toLowerCase()} cohort-wide
            — none currently in your direct caseload. Click another status above or{' '}
            <button
              type="button"
              onClick={() => setFilter(null)}
              style={{
                color: 'var(--ac-b)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              show all
            </button>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visibleClients.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => onOpen(x.id)}
              className="glass p-6 text-left transition-all client-card"
              data-testid={`caseload-client-${x.id}`}
              aria-label={`Open ${x.name} profile`}
              style={{
                borderColor: 'var(--line-s)',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center serif text-lg"
                  style={{
                    background: 'color-mix(in srgb, var(--ac) 14%, transparent)',
                    color: 'var(--ac-b)',
                    border: '1px solid color-mix(in srgb, var(--ac) 30%, transparent)',
                  }}
                >
                  {x.init}
                </div>
                <div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{x.name}</div>
                  <span
                    className={`chip ${
                      x.status === 'flagged'
                        ? 'chip-warn'
                        : x.status === 'plateau'
                        ? ''
                        : x.status === 'new'
                        ? 'chip-cy'
                        : 'chip-ac'
                    }`}
                    style={{ marginTop: 4 }}
                  >
                    {x.status}
                  </span>
                </div>
              </div>
              <div className="mb-3"><DEXAChart data={x.scans} height={80} /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] mono" style={{ color: 'var(--ink-m)' }}>
                <div>FAT {x.met.fat}</div>
                <div>LEAN {x.met.lean}</div>
                <div>VISC {x.met.visc}</div>
              </div>
              <div
                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                style={{
                  background: 'color-mix(in srgb, var(--ac) 12%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--ac) 28%, transparent)',
                  color: 'var(--ac-b)',
                  fontWeight: 500,
                }}
              >
                Open full profile <span style={{ fontSize: 14, lineHeight: 1 }}>→</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
