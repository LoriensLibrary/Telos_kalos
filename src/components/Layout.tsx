import { NavLink, Outlet } from 'react-router-dom';
import ThemeToggle from './ui/ThemeToggle';

const NAV = [
  { to: '/', label: 'Overview' },
  { to: '/member', label: 'Member' },
  { to: '/performance', label: 'Performance' },
  { to: '/data', label: 'Privacy' },
  { to: '/platform', label: 'Platform' },
];

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(6,8,12,0.55)',
          backdropFilter: 'blur(32px) saturate(160%)',
          WebkitBackdropFilter: 'blur(32px) saturate(160%)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div className="max-w-[1500px] mx-auto px-8">
          <div className="flex items-center justify-between py-4 gap-6">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, color-mix(in srgb, var(--ac) 22%, transparent), color-mix(in srgb, var(--cy) 16%, transparent))',
                    border: '1px solid color-mix(in srgb, var(--cy) 26%, transparent)',
                    boxShadow: '0 0 22px color-mix(in srgb, var(--ac) 18%, transparent)',
                  }}
                >
                  <span
                    className="serif italic text-base"
                    style={{ color: 'var(--ac-b)', fontWeight: 400, lineHeight: 1 }}
                  >
                    T
                  </span>
                </div>
                <div>
                  <div className="text-sm leading-none" style={{ fontWeight: 500 }}>
                    <span className="serif italic">Telos</span>{' '}
                    <span style={{ color: 'var(--ink-m)' }}>·</span>{' '}
                    <span style={{ color: 'var(--ac-b)' }}>for Kalos</span>
                  </div>
                  <div className="lbl mt-1" style={{ fontSize: 9 }}>
                    v0.6 · KALOS BUILD
                  </div>
                </div>
              </div>
              <nav className="flex items-center gap-7">
                {NAV.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.to === '/'}
                    className={({ isActive }) =>
                      `text-[13px] pb-1 border-b-2 transition-colors ${
                        isActive
                          ? 'text-[var(--ink)] border-[color:var(--ac)]'
                          : 'text-[color:var(--ink-m)] border-transparent hover:text-[var(--ink)]'
                      }`
                    }
                    style={({ isActive }) =>
                      isActive
                        ? { color: 'var(--ink)', borderBottomColor: 'var(--ac-b)' }
                        : { color: 'var(--ink-m)' }
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <span className="chip chip-cy">
                <span className="dot dot-cy pulse" />
                LIVE DEMO
              </span>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer style={{ borderTop: '1px solid var(--line)' }}>
        <div className="max-w-[1500px] mx-auto px-8 py-8 flex items-center justify-between flex-wrap gap-4">
          <div className="text-xs" style={{ color: 'var(--ink-m)' }}>
            <span
              className="serif italic"
              style={{ fontWeight: 400, fontSize: 16, color: 'var(--ink)' }}
            >
              Telos
            </span>
            <span className="mx-3 mono">·</span>Architecture by Angela Reinhold
            <span className="mx-3 mono">·</span>Telos for Kalos · v0.6
          </div>
          <div className="lbl">DEMO · MAY 13, 2026 · LIVEKALOS.COM</div>
        </div>
      </footer>
    </div>
  );
}
