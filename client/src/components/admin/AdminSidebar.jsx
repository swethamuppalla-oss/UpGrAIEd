import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'A'
}

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard',     path: '/dashboard/admin' },
  { icon: '⚙️', label: 'Control Panel', path: '/admin-control' },
  { icon: '📝', label: 'Content',       path: '/admin/content' },
  { icon: '🎨', label: 'UI Config',     path: '/admin/ui' },
]

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dark-surface" style={{
      width: 240,
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      borderRight: '1px solid var(--bg-soft)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
    }}>
      {/* Branding */}
      <div style={{
        padding: '24px 24px 24px',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <span style={{
          fontFamily: "'Clash Display', 'Inter', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #9B6FF4, #3B82F6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          UpgrAIed
        </span>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Admin
        </div>
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        overflowY: 'auto',
      }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: 14,
                fontFamily: "'Satoshi', 'Inter', sans-serif",
                textDecoration: 'none',
                transition: 'all 0.2s',
                border: isActive ? '1px solid rgba(123,63,228,0.2)' : '1px solid transparent',
                background: isActive ? 'rgba(123,63,228,0.15)' : 'transparent',
                color: isActive ? '#9B67F0' : 'var(--text-secondary)',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-soft)'
                  e.currentTarget.style.color = 'var(--text-inverse)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + sign-out */}
      <div style={{
        borderTop: '1px solid var(--border-color)',
        padding: '16px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7B3FE4, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 13, fontWeight: 600, flexShrink: 0,
          }}>
            {getInitials(user?.name)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-inverse)' }}>
              {user?.name || 'Admin'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>admin</div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 10,
            fontSize: 14,
            fontFamily: "'Satoshi', 'Inter', sans-serif",
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%',
            border: 'none',
            background: 'transparent',
            color: 'rgba(255,80,80,0.7)',
            textAlign: 'left',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-soft)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
