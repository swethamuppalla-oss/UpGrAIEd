export default function Sidebar({
  items,
  activeItem,
  onItemClick,
  userName,
  userRole,
  userInitials,
  onSignOut
}) {
  return (
    <div style={{
      width: '240px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: '#0F0B1C',
      borderRight: '1px solid rgba(255,255,255,0.08)',
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
          const isActive = activeItem === item.id
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
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
                border: isActive ? '1px solid rgba(123,63,228,0.2)' : 'none',
                background: isActive ? 'rgba(123,63,228,0.15)' : 'transparent',
                color: isActive ? '#9B67F0' : 'var(--text-secondary)',
                textAlign: 'left' // For the `<button>` baseline
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-card)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
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
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
