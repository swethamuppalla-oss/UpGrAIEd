import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Features', path: '/#features' },
  { label: 'About', path: '/why' },
  { label: 'Pricing', path: '/pricing' },
];

const PRODUCTS = [
  {
    icon: '🤖',
    label: 'UpGrAIEd AI Learning',
    sub: 'AI-powered adaptive learning · Grades 5–12',
    path: '/upgraied',
    badge: 'Live',
    badgeColor: '#6EDC5F',
    badgeBg: 'rgba(110,220,95,0.15)',
  },
  {
    icon: '📚',
    label: 'UpGrEd Platform',
    sub: 'School curriculum ecosystem · Coming soon',
    path: '/upgred',
    badge: 'Soon',
    badgeColor: '#F59E0B',
    badgeBg: 'rgba(245,158,11,0.12)',
  },
];

export default function BrandTopBar({ dark = false }) {
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef                     = useRef(null);
  const navigate                        = useNavigate();
  const location                        = useLocation();
  const { isAuthenticated, user }       = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin')   return '/dashboard/admin';
    if (user.role === 'parent')  return '/dashboard/parent';
    return '/dashboard/student';
  };

  const navTextColor = dark
    ? (scrolled ? '#1A1A2E' : 'rgba(255,255,255,0.8)')
    : '#374151';

  const logoTextGradient = dark && !scrolled
    ? 'linear-gradient(135deg, #A8F5A2, #6EDC5F)'
    : 'linear-gradient(135deg, #2A7A20, #6EDC5F)';

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(20px, 4vw, 48px)',
        background: scrolled
          ? 'rgba(255,255,255,0.92)'
          : dark ? 'transparent' : 'rgba(255,255,255,0.85)',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : dark ? 'none' : 'blur(12px)',
        borderBottom: scrolled
          ? '1px solid rgba(110,220,95,0.12)'
          : 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.06)' : 'none',
      }}>

        {/* ── Logo ─────────────────────────────── */}
        <div
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 19, boxShadow: '0 3px 14px rgba(110,220,95,0.4)',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >🌿</div>
          <span style={{
            fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em',
            background: logoTextGradient,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>UpGrAIEd</span>
        </div>

        {/* ── Desktop nav ──────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
        }} className="brand-nav-desktop">

          {/* Products dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setProductsOpen(p => !p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 14, fontWeight: 500, color: navTextColor,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 14px', borderRadius: 8,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(110,220,95,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              Products
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{
                transform: productsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                opacity: 0.6,
              }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Dropdown panel */}
            {productsOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
                transform: 'translateX(-50%)',
                background: '#fff', borderRadius: 16,
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                padding: 8, minWidth: 280,
                animation: 'fadeSlideDown 0.18s ease',
              }}>
                {PRODUCTS.map(p => (
                  <div
                    key={p.path}
                    onClick={() => { navigate(p.path); setProductsOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 10,
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9F9F7'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, fontSize: 20,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: '#F5F4F1', flexShrink: 0,
                    }}>{p.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{p.label}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                          color: p.badgeColor, background: p.badgeBg,
                          padding: '2px 7px', borderRadius: 20,
                        }}>{p.badge}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#7A8A82' }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                fontSize: 14, fontWeight: 500, color: navTextColor,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 14px', borderRadius: 8,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(110,220,95,0.08)';
                e.currentTarget.style.color = '#0A1F12';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = navTextColor;
              }}
            >
              {link.label}
            </button>
          ))}

          <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.1)', margin: '0 8px' }} />

          {isAuthenticated ? (
            <button
              onClick={() => navigate(getDashboardPath())}
              style={{
                padding: '9px 20px', borderRadius: 22,
                background: 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
                color: '#0A1F12', border: 'none',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(110,220,95,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(110,220,95,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(110,220,95,0.35)'; }}
            >
              Dashboard →
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '9px 18px', borderRadius: 22,
                  background: 'none', border: '1px solid rgba(110,220,95,0.4)',
                  color: dark && !scrolled ? '#6EDC5F' : '#3DAA3A',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(110,220,95,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/reserve')}
                style={{
                  padding: '9px 20px', borderRadius: 22,
                  background: 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
                  color: '#0A1F12', border: 'none',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(110,220,95,0.35)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(110,220,95,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(110,220,95,0.35)'; }}
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ─────────────────── */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="brand-nav-mobile"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            width: 36, height: 36, display: 'none',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}
          aria-label="Menu"
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: i === 1 ? 18 : 24, height: 2, borderRadius: 2,
              background: dark && !scrolled ? '#fff' : '#1A1A2E',
              transition: 'all 0.2s',
            }} />
          ))}
        </button>
      </nav>

      {/* ── Mobile slide-down menu ──────────── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, zIndex: 999,
          background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(110,220,95,0.12)',
          padding: '20px 24px 28px',
          display: 'flex', flexDirection: 'column', gap: 4,
          animation: 'fadeSlideDown 0.2s ease',
        }}>
          {PRODUCTS.map(p => (
            <button
              key={p.path}
              onClick={() => { navigate(p.path); setMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 10,
                background: 'none', border: 'none', cursor: 'pointer',
                width: '100%', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{p.label}</div>
                <div style={{ fontSize: 11, color: '#7A8A82' }}>{p.sub}</div>
              </div>
            </button>
          ))}
          <div style={{ height: 1, background: '#F0F0EC', margin: '8px 0' }} />
          {NAV_LINKS.map(link => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
              style={{
                fontSize: 15, fontWeight: 500, color: '#374151',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '10px 14px', borderRadius: 8, textAlign: 'left',
              }}
            >{link.label}</button>
          ))}
          <div style={{ marginTop: 8, display: 'flex', gap: 10 }}>
            <button onClick={() => { navigate('/login'); setMenuOpen(false); }} style={{
              flex: 1, padding: '12px', borderRadius: 22, border: '1px solid rgba(110,220,95,0.4)',
              background: 'none', color: '#3DAA3A', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>Login</button>
            <button onClick={() => { navigate('/reserve'); setMenuOpen(false); }} style={{
              flex: 1, padding: '12px', borderRadius: 22, border: 'none',
              background: 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
              color: '#0A1F12', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Get Started</button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .brand-nav-desktop { display: none !important; }
          .brand-nav-mobile  { display: flex !important; }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
