import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutApi } from '../../services/auth';

/**
 * Shared sidebar used across all dashboard pages.
 *
 * Props:
 *   items: [{ icon, label, to }]
 */
const Sidebar = ({ items = [] }) => {
  const navigate        = useNavigate();
  const location        = useLocation();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    try { await logoutApi(); } catch { /* server may be unreachable */ }
    logout();
    navigate('/login', { replace: true });
  };

  // Initials avatar
  const initials = (user?.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      style={{
        position:    'fixed',
        top:         0,
        left:        0,
        height:      '100vh',
        width:       240,
        background:  '#0F0B1C',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display:     'flex',
        flexDirection: 'column',
        zIndex:      40,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px' }}>
        <span
          className="font-clash font-bold text-xl grad-text"
          style={{ letterSpacing: '-0.02em' }}
        >
          UpgrAIed
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
        {items.map(({ icon, label, to }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <button
              key={to}
              onClick={() => navigate(to)}
              style={{ width: '100%', textAlign: 'left' }}
              className={`
                flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1
                text-sm font-medium transition-all duration-150 cursor-pointer
                ${active
                  ? 'bg-white/10 text-[var(--text)]'
                  : 'text-[var(--text2)] hover:bg-white/5 hover:text-[var(--text)]'}
              `}
            >
              {/* Active indicator bar */}
              <span
                style={{
                  width:        3,
                  height:       18,
                  borderRadius: 2,
                  background:   active ? 'linear-gradient(180deg,#FF5C28,#7B3FE4)' : 'transparent',
                  flexShrink:   0,
                  marginLeft:   -4,
                }}
              />
              <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Avatar + info */}
        <div className="flex items-center gap-3 px-3 mb-3">
          <div
            className="grad-bg flex items-center justify-center shrink-0 font-clash font-bold text-white text-sm"
            style={{ width: 36, height: 36, borderRadius: 10 }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--text)] truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs capitalize" style={{ color: 'var(--text2)' }}>
              {user?.role || ''}
            </p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="
            w-full flex items-center gap-2 rounded-xl px-3 py-2.5
            text-sm text-[var(--text2)] hover:bg-white/5 hover:text-[var(--text)]
            transition-all duration-150 cursor-pointer
          "
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
