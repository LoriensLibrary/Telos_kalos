import { useEffect, useRef, useState } from 'react';

type Theme = 'kalos' | 'cyber' | 'aurora' | 'galaxy' | 'mono' | 'sage' | 'crimson';

const THEMES: { id: Theme; label: string; sw: [string, string] }[] = [
  { id: 'kalos', label: 'Kalos', sw: ['#4570FF', '#8080F7'] },
  { id: 'cyber', label: 'Cyber', sw: ['#7DD3FC', '#B49AFF'] },
  { id: 'aurora', label: 'Aurora', sw: ['#FFB87A', '#FF9988'] },
  { id: 'galaxy', label: 'Galaxy', sw: ['#D946EF', '#22D3EE'] },
  { id: 'mono', label: 'Mono', sw: ['#FAFAFA', '#A1A1AA'] },
  { id: 'sage', label: 'Sage', sw: ['#84CC95', '#D9E8B7'] },
  { id: 'crimson', label: 'Crimson', sw: ['#DC2626', '#F59E0B'] },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'kalos';
    const saved =
      (localStorage.getItem('telos.theme') as Theme | null) ||
      (localStorage.getItem('companion.theme') as Theme | 'verdant' | null);
    if (saved === 'verdant' || !saved) return 'kalos';
    return saved as Theme;
  });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('telos.theme', theme);
    localStorage.removeItem('companion.theme');
  }, [theme]);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          padding: '7px 12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          fontFamily: 'Geist Mono, monospace',
          fontSize: 11,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid var(--line-s)',
          borderRadius: 12,
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.45), 0 8px 18px -8px rgba(0,0,0,0.50)',
        }}
      >
        <span
          aria-hidden
          style={{
            width: 18,
            height: 10,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${current.sw[0]}, ${current.sw[1]})`,
            boxShadow: `0 0 8px ${current.sw[0]}90`,
            display: 'inline-block',
          }}
        />
        <span>{current.label}</span>
        <span
          aria-hidden
          style={{
            fontSize: 9,
            opacity: 0.6,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 160ms ease',
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Theme"
          className="glass-deep"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 200,
            padding: 6,
            zIndex: 100,
          }}
        >
          {THEMES.map((t) => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                role="option"
                aria-selected={active}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: 'none',
                  background: active
                    ? 'color-mix(in srgb, var(--ac) 12%, transparent)'
                    : 'transparent',
                  color: active ? 'var(--ink)' : 'var(--ink-s)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'Geist Mono, monospace',
                  fontSize: 11,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  transition: 'background 120ms ease, color 120ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 18,
                    height: 10,
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${t.sw[0]}, ${t.sw[1]})`,
                    boxShadow: `0 0 8px ${t.sw[0]}90`,
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1 }}>{t.label}</span>
                {active && (
                  <span aria-hidden style={{ color: 'var(--ac)', fontSize: 12 }}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
