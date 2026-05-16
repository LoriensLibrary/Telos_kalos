import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import ThemeToggle from './ui/ThemeToggle';

const NAV = [
  { to: '/', label: 'Overview' },
  { to: '/member', label: 'Member' },
  { to: '/performance', label: 'Performance' },
  { to: '/data', label: 'Privacy' },
  { to: '/cama', label: 'CAMA Proof' },
  { to: '/platform', label: 'Platform' },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // Lock body scroll while the mobile menu is open. The cleanup restores the
  // previous overflow value; route changes close the menu via NavLink onClick
  // handlers below (no effect-driven setState — the react-hooks/set-state-in-
  // effect rule reasonably blocks that pattern).
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:rounded focus:bg-[color:var(--bg)] focus:text-[color:var(--ink)] focus:border focus:border-[color:var(--ac)]"
      >
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(6,8,12,0.55)',
          backdropFilter: 'blur(32px) saturate(160%)',
          WebkitBackdropFilter: 'blur(32px) saturate(160%)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div className="max-w-[1500px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-4 gap-4 md:gap-6">
            <div className="flex items-center gap-6 md:gap-10 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
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
                <div className="min-w-0">
                  <div className="text-sm leading-none truncate" style={{ fontWeight: 500 }}>
                    <span className="serif italic">Telos</span>{' '}
                    <span style={{ color: 'var(--ink-m)' }}>·</span>{' '}
                    <span style={{ color: 'var(--ac-b)' }}>for Kalos</span>
                  </div>
                  <div className="lbl mt-1 hidden sm:block" style={{ fontSize: 9 }}>
                    v0.6 · KALOS BUILD
                  </div>
                </div>
              </div>

              {/* Desktop nav — hidden below md */}
              <nav aria-label="Primary" className="hidden md:flex items-center gap-7">
                {NAV.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.to === '/'}
                    className="text-[13px] pb-1 border-b-2 transition-colors"
                    style={({ isActive }) =>
                      isActive
                        ? { color: 'var(--ink)', borderBottomColor: 'var(--ac-b)' }
                        : { color: 'var(--ink-m)', borderBottomColor: 'transparent' }
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <span className="chip chip-cy hidden sm:inline-flex">
                <span className="dot dot-cy pulse" />
                LIVE DEMO
              </span>

              {/* Mobile hamburger — hidden at md+ */}
              <button
                type="button"
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg"
                style={{
                  border: '1px solid var(--line)',
                  background: 'rgba(255,255,255,0.02)',
                }}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 18,
                    height: 2,
                    background: 'var(--ink)',
                    transition: 'transform 200ms, opacity 200ms',
                    transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    width: 18,
                    height: 2,
                    background: 'var(--ink)',
                    margin: '3px 0',
                    transition: 'opacity 200ms',
                    opacity: menuOpen ? 0 : 1,
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    width: 18,
                    height: 2,
                    background: 'var(--ink)',
                    transition: 'transform 200ms, opacity 200ms',
                    transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Mobile menu panel */}
          {menuOpen && (
            <nav
              id="mobile-nav"
              aria-label="Primary mobile"
              className="md:hidden pb-5 pt-1 flex flex-col gap-1"
              style={{ borderTop: '1px solid var(--line)' }}
            >
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === '/'}
                  onClick={closeMenu}
                  className="block px-3 py-3 rounded-lg text-sm transition-colors"
                  style={({ isActive }) =>
                    isActive
                      ? {
                          color: 'var(--ink)',
                          background:
                            'color-mix(in srgb, var(--ac) 14%, transparent)',
                          fontWeight: 500,
                        }
                      : { color: 'var(--ink-m)' }
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <div className="flex items-center gap-2 mt-3 px-3">
                <ThemeToggle />
                <span className="chip chip-cy">
                  <span className="dot dot-cy pulse" />
                  LIVE DEMO
                </span>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer style={{ borderTop: '1px solid var(--line)' }}>
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-8 flex items-center justify-between flex-wrap gap-4">
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
