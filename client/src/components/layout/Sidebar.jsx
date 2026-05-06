import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({
  items,
  activeItem,
  onItemClick,
  userName,
  userRole,
  userInitials,
  onSignOut
}) {
  const location = useLocation()

  return (
    <div className="dark-surface" style={{
      width: '240px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      borderRight: '1px solid var(--bg-soft)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50
    }}>
      {/* Top Section */}
      <div style={{
        padding: '0 24px 24px',
        borderBottom: '1px solid var(--border-color)',
        paddingTop: '24px' // Adding little padding for logo
      }}>
        <span style={{
          fontFamily: "'Clash Display', 'Inter', sans-serif",
          fontSize: '20px',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #9B6FF4, #3B82F6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          UpgrAIed
        </span>
      </div>

      {/* Nav Items */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto'
      }}>
        {items.map((item) => {
          if (item.divider) {
            return (
              <div key={item.id} style={{
                padding: '12px 12px 4px',
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderTop: '1px solid var(--border-color)',
                marginTop: 8,
              }}>
                {item.label}
              </div>
            )
          }

          const isActive = item.path
            ? location.pathname === item.path
            : activeItem === item.id

          const sharedStyle = {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: "'Satoshi', 'Inter', sans-serif",
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%',
            border: isActive ? '1px solid rgba(123,63,228,0.2)' : 'none',
            background: isActive ? 'rgba(123,63,228,0.15)' : 'transparent',
            color: isActive ? '#9B67F0' : 'var(--text-secondary)',
            textAlign: 'left',
            textDecoration: 'none',
          }

          const hoverOn = (e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'var(--bg-soft)'
              e.currentTarget.style.color = 'var(--text-inverse)'
            }
          }
          const hoverOff = (e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }
          }

          if (item.path) {
            return (
              <Link
                key={item.id}
                to={item.path}
                style={sharedStyle}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              style={sharedStyle}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        padding: '16px 12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px'
        }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7B3FE4, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '13px', fontWeight: 600
          }}>
            {userInitials}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-inverse)' }}>
              {userName || 'User'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {userRole || 'member'}
            </div>
          </div>
        </div>

        <button
          onClick={onSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: "'Satoshi', 'Inter', sans-serif",
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%',
            border: 'none',
            background: 'transparent',
            color: 'rgba(255,80,80,0.7)',
            textAlign: 'left'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-soft)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
