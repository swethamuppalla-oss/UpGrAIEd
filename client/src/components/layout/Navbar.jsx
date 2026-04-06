import { useAuth } from '../../context/AuthContext';

/**
 * Top navbar used inside dashboard pages (sits within the main content area).
 * Props:
 *   title: string — page title shown on the left
 */
const Navbar = ({ title = '' }) => {
  const { user } = useAuth();

  const initials = (user?.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding:      '0 0 32px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: 32,
      }}
    >
      {/* Page title */}
      <h2
        className="font-clash font-semibold text-[var(--text)]"
        style={{ fontSize: 20, margin: 0 }}
      >
        {title}
      </h2>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="
            flex items-center justify-center rounded-xl
            transition-colors hover:bg-white/10
          "
          style={{
            width:      38,
            height:     38,
            background: 'rgba(255,255,255,0.05)',
            border:     '1px solid rgba(255,255,255,0.08)',
            fontSize:   18,
          }}
          title="Notifications"
        >
          🔔
        </button>

        {/* Avatar */}
        <div
          className="grad-bg flex items-center justify-center font-clash font-bold text-white text-sm"
          style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0 }}
          title={user?.name}
        >
          {initials}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
