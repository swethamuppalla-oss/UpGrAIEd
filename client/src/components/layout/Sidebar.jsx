import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutApi } from '../../services/auth';

const Sidebar = ({
  items = [],
  activeItem,
  userName,
  userRole,
  userInitials,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await logoutApi();
    } catch {
      // The local logout still clears the session if the API is unavailable.
    }

    logout();
    navigate('/login', { replace: true });
  };

  const initialsSource = userInitials || user?.name || 'U';
  const initials = initialsSource
    .toString()
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const resolvedName = userName || user?.name || 'User';
  const resolvedRole = userRole || user?.role || '';

  const isItemActive = (item) => {
    if (activeItem) {
      return activeItem === (item.id || item.label);
    }

    if (!item.to) {
      return false;
    }

    return location.pathname === item.to || location.pathname.startsWith(item.to + '/');
  };

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
      setIsMobileOpen(false);
      return;
    }

    if (item.to) {
      navigate(item.to);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen((open) => !open)}
        className="md:hidden fixed left-4 top-4 z-50 flex items-center justify-center rounded-xl"
        style={{
          width: 42,
          height: 42,
          background: 'var(--dark2)',
          border: '1px solid var(--border)',
        }}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(8, 6, 15, 0.72)' }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-[240px] md:translate-x-0
          transition-transform duration-200
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: 'var(--dark2)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '28px 24px 20px' }}>
          <span
            className="font-clash font-bold text-xl grad-text"
            style={{ letterSpacing: '-0.02em' }}
          >
            UpgrAIed
          </span>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
          {items.map((item) => {
            const active = isItemActive(item);

            return (
              <button
                key={item.id || item.to || item.label}
                onClick={() => handleItemClick(item)}
                style={{ width: '100%', textAlign: 'left' }}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1
                  text-sm font-medium transition-all duration-150 cursor-pointer
                  ${active
                    ? 'bg-white/10 text-[var(--text)]'
                    : 'text-[var(--text2)] hover:bg-white/5 hover:text-[var(--text)]'}
                `}
              >
                <span
                  style={{
                    width: 3,
                    height: 18,
                    borderRadius: 2,
                    background: active ? 'var(--grad2)' : 'transparent',
                    flexShrink: 0,
                    marginLeft: -4,
                  }}
                />
                <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 px-3 mb-3">
            <div
              className="grad-bg flex items-center justify-center shrink-0 font-clash font-bold text-white text-sm"
              style={{ width: 36, height: 36, borderRadius: 10 }}
            >
              {initials}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--text)] truncate">
                {resolvedName}
              </p>
              <p className="text-xs capitalize" style={{ color: 'var(--text2)' }}>
                {resolvedRole}
              </p>
            </div>
          </div>

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
    </>
  );
};

export default Sidebar;
