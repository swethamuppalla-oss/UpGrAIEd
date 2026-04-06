import { useState } from 'react'

export default function Sidebar({
  items,
  activeItem,
  onItemClick,
  userName,
  userRole,
  userInitials,
  onSignOut,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleItemClick = (id) => {
    onItemClick(id)
    setMobileOpen(false)
  }

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div style={{
        padding: '22px 20px',
        borderBottom: '1px solid var(--border-color)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ color: 'var(--accent-purple-light)' }}>Upgr</span>
          <span style={{
            background: 'linear-gradient(135deg, var(--accent-purple-light), var(--accent-blue))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>AI</span>
          <span style={{ color: 'var(--text-primary)' }}>ed</span>
        </span>
      </div>

      {/* ── Nav items ────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item${activeItem === item.id ? ' active' : ''}`}
            onClick={() => handleItemClick(item.id)}
          >
            <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
            <span style={{ fontSize: 14, fontWeight: activeItem === item.id ? 600 : 500 }}>
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* ── User bottom ──────────────────────────────────────────── */}
      <div style={{
        padding: '14px 12px',
        borderTop: '1px solid var(--border-color)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div className="avatar-circle" style={{ width: 36, height: 36, fontSize: 12 }}>
            {userInitials}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {userName || 'User'}
            </div>
            <div style={{
              fontSize: 11,
              color: 'var(--text-secondary)',
              textTransform: 'capitalize',
            }}>
              {userRole || 'member'}
            </div>
          </div>
        </div>

        <button
          className="btn-ghost"
          style={{ width: '100%', fontSize: 13, padding: '8px 12px' }}
          onClick={onSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Mobile hamburger ─────────────────────────────────────── */}
      <button
        className="hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed',
          top: 14,
          left: 14,
          zIndex: 1100,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 8,
          padding: '7px 10px',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontSize: 18,
          lineHeight: 1,
        }}
        aria-label="Toggle menu"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* ── Overlay (mobile) ─────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            zIndex: 999,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* ── Sidebar panel ────────────────────────────────────────── */}
      <div
        className={`sidebar${mobileOpen ? ' sidebar-mobile-open' : ''}`}
        style={{ zIndex: 1000 }}
      >
        {sidebarContent}
      </div>
    </>
  )
}
