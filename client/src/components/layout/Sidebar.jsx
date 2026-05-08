import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Sidebar({
  items,
  activeItem,
  onItemClick,
  userName,
  userRole,
  userInitials,
  onSignOut
}) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div style={{
      width: '240px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
    }}>
      {/* Logo — click to go home */}
      <div
        onClick={() => navigate('/')}
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          transition: 'opacity 0.2s',
        }}
        title="Back to Home"
        onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, boxShadow: '0 2px 8px rgba(110,220,95,0.3)',
        }}>
          🌿
        </div>
        <span style={{
          fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #2A7A20, #6EDC5F)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          UpGrAIEd
        </span>
      </div>

      {/* Product Selector Dropdown */}
      <div style={{ padding: '0 12px 12px', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 10,
            background: 'var(--bg-soft)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            color: 'var(--text-inverse)',
            fontFamily: "'Satoshi', 'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(123,63,228,0.4)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>🧠</span>
            UpGrAIEd
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            ▼
          </span>
        </button>

        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% - 8px)',
            left: 12,
            right: 12,
            background: '#1a1b26',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: 4,
            zIndex: 100,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            <button style={{
              width: '100%', padding: '8px 10px', borderRadius: 6,
              background: 'rgba(123,63,228,0.15)', border: 'none',
              display: 'flex', alignItems: 'center', gap: 8,
              color: '#9B67F0', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              <span style={{ fontSize: 16 }}>🧠</span> UpGrAIEd
            </button>
            <button style={{
              width: '100%', padding: '8px 10px', borderRadius: 6,
              background: 'transparent', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, cursor: 'not-allowed',
              opacity: 0.7,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>📚</span> UpGrEd
              </div>
              <span style={{ fontSize: 9, background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4, color: '#fff' }}>
                Soon
              </span>
            </button>
          </div>
        )}
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
