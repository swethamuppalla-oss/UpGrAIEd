import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { demoLogin as demoLoginRequest, login as loginRequest } from '../services/authService'
import { trackEvent, identifyUser, EVENTS } from '../utils/analytics'

const ROLE_ROUTES = {
  student: '/dashboard/student',
  parent:  '/dashboard/parent',
  admin:   '/dashboard/admin',
}

/* ─── Demo role config ──────────────────────────────────────── */
const DEMO_ROLES = [
  {
    id: 'parent',
    icon: '👨‍👩‍👧',
    label: 'Parent',
    tagline: 'Family Portal',
    gradient: 'linear-gradient(135deg, #FF7A2F 0%, #FF4E8A 100%)',
    token: 'demo-token-parent',
  },
  {
    id: 'student',
    icon: '🎓',
    label: 'Student',
    tagline: 'Learning Portal',
    gradient: 'linear-gradient(135deg, #7B3FE4 0%, #3B82F6 100%)',
    token: 'demo-token-student',
  },
  {
    id: 'admin',
    icon: '🛠️',
    label: 'Admin',
    tagline: 'Control Center',
    gradient: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)',
    token: 'demo-token-admin',
  },
]

/* ─── Floating orb component ────────────────────────────────── */
function Orb({ style }) {
  return (
    <div style={{
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(80px)',
      pointerEvents: 'none',
      ...style,
    }} />
  )
}

/* ─── Main Login page ───────────────────────────────────────── */
export default function Login() {
  const navigate  = useNavigate()
  const { login, user } = useAuth()

  const [hoveredRole,  setHoveredRole]  = useState(null)
  const [activeRole,   setActiveRole]   = useState(null)
  const [loadingRole,  setLoadingRole]  = useState(null)
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formLoading,  setFormLoading]  = useState(false)
  const [formError,    setFormError]    = useState('')
  const [mounted,      setMounted]      = useState(false)

  const location = useLocation()

  /* Kick entrance animation and handle role query param */
  useEffect(() => { 
    setMounted(true) 
    const roleParam = new URLSearchParams(location.search).get("role")
    if (roleParam) {
      const demoRole = DEMO_ROLES.find(r => r.id === roleParam)
      if (demoRole) {
        handleDemoLogin(demoRole)
      }
    }
  }, [location.search])

  /* Redirect if already logged in */
  useEffect(() => {
    if (user?.role && ROLE_ROUTES[user.role]) {
      navigate(ROLE_ROUTES[user.role], { replace: true })
    }
  }, [user, navigate])

  /* ── Demo login ────────────────────────────────────────────── */
  const handleDemoLogin = async (role) => {
    if (loadingRole) return
    setActiveRole(role.id)
    setLoadingRole(role.id)

    try {
      const data = await demoLoginRequest(role.id)
      login(data.user, data.token)
      trackEvent(EVENTS.LOGIN_SUCCESS, { method: 'demo', role: role.id })
      identifyUser(data.user?._id || data.user?.id)
      navigate(ROLE_ROUTES[role.id], { replace: true })
    } catch (err) {
      console.error('Demo login error:', err)
      setFormError(err.message)
      setLoadingRole(null)
    }
  }

  /* ── Manual login (placeholder — wire to real API when ready) ── */
  const handleManualLogin = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!email || !password) {
      setFormError('Please enter both email and password.')
      return
    }
    setFormLoading(true)
    try {
      const data = await loginRequest(email, password)
      if (import.meta.env.DEV) console.log('TOKEN:', data.token?.slice(0, 20) + '…')
      login(data.user, data.token)
      trackEvent(EVENTS.LOGIN_SUCCESS, { method: 'email', role: data.user.role })
      identifyUser(data.user?._id || data.user?.id)
      navigate(ROLE_ROUTES[data.user?.role] ?? '/', { replace: true })
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', -apple-system, sans-serif",
      overflow: 'hidden',
      position: 'relative',
      background: 'var(--bg-main)',
    }}>
      <button
        onClick={() => navigate('/')}
        className="btn-ghost"
        style={{
          position: 'absolute', top: 24, left: 32, zIndex: 10,
          padding: '8px 16px', fontSize: 14, color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)', borderRadius: 20,
        }}
      >
        ← Back to Home
      </button>

      {/* ── Global ambient orbs ─────────────────────────────── */}
      <Orb style={{ width: 700, height: 700, background: 'rgba(123,63,228,0.06)', top: -200, left: -200 }} />
      <Orb style={{ width: 500, height: 500, background: 'rgba(34,197,94,0.05)', bottom: -100, right: 200 }} />

      {/* ══════════════ LEFT BRANDING PANEL ══════════════════ */}
      <div style={{
        flex: '0 0 420px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 52px',
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid var(--border-color)',
        background: 'var(--bg-soft)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(-30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        {/* Panel gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(160deg, rgba(34,197,94,0.03) 0%, rgba(255,255,255,0) 100%)',
        }} />

        {/* Logo */}
        <div style={{ marginBottom: 48, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 14,
            padding: '10px 16px',
            marginBottom: 32,
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <span style={{ fontSize: 22 }}>🌿</span>
            <span style={{
              fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #3DAA3A, #6EDC5F)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>UpGrAIEd</span>
          </div>

          <h1 className="clash-display" style={{
            fontSize: 40, fontWeight: 800, letterSpacing: '-0.01em',
            lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: 16,
          }}>
            Build.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #3DAA3A 0%, #6EDC5F 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Learn.</span>
            {' '}Earn<br />with AI.
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, maxWidth: 300 }}>
            A premium learning ecosystem designed for the next generation of builders.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 }}>
          {[
            { icon: '⚡', text: 'AI-powered personalised learning journey' },
            { icon: '🏆', text: 'Gamified badge & reward system' },
            { icon: '👨‍👩‍👧', text: 'Real-time parent progress tracking' },
            { icon: '📊', text: 'In-depth analytics for every role' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
              transition: `opacity 0.5s ${0.2 + i * 0.08}s ease, transform 0.5s ${0.2 + i * 0.08}s ease`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <p style={{
          marginTop: 40, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
          Trusted by 10,000+ students across India
        </p>
      </div>

      {/* ══════════════ RIGHT LOGIN PANEL ════════════════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 32px',
        overflowY: 'auto',
        position: 'relative',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(30px)',
        transition: 'opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <h2 className="clash-display" style={{
              fontSize: 32, color: 'var(--text-primary)', marginBottom: 8,
            }}>Welcome Back 👋</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Sign in to your UpGrAIEd account
            </p>
          </div>

          {/* ─── Manual login form ───────────────────────────── */}
          <div className="ui-card" style={{ padding: '32px 40px', marginBottom: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
            <form onSubmit={handleManualLogin}>
              {formError && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: '#DC2626', fontSize: 13, fontWeight: 500
                }}>
                  <span>⚠️</span> {formError}
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 700,
                  color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 15, pointerEvents: 'none', opacity: 0.5,
                  }}>📧</span>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={formLoading}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 700,
                  color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 15, pointerEvents: 'none', opacity: 0.5,
                  }}>🔒</span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={formLoading}
                    style={{ ...inputStyle, paddingRight: 48 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', fontSize: 16, padding: 4, borderRadius: 6,
                      transition: 'color 0.2s',
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                id="login-submit"
                type="submit"
                disabled={formLoading}
                className="btn-primary"
                style={{
                  width: '100%', padding: '14px 20px',
                  opacity: formLoading ? 0.7 : 1,
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {formLoading ? (
                  <>
                    <span className="spinner" style={{ borderTopColor: 'white' }} />
                    Signing in…
                  </>
                ) : (
                  <>Secure Login →</>
                )}
              </button>
            </form>
          </div>

          {/* ─── Demo login row (Subtle) ──────────────────────── */}
          <div style={{
            background: 'var(--bg-soft)',
            border: '1px solid var(--border-color)',
            borderRadius: 16,
            padding: '20px 24px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              One-Click Demo Access
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {DEMO_ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleDemoLogin(role)}
                  disabled={!!loadingRole}
                  style={{
                    padding: '8px 16px', borderRadius: 20,
                    background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)', fontSize: 13, fontWeight: 600,
                    cursor: loadingRole ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={e => {
                    if (!loadingRole) {
                      e.currentTarget.style.borderColor = 'var(--brand-primary)'
                      e.currentTarget.style.color = 'var(--brand-primary)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!loadingRole) {
                      e.currentTarget.style.borderColor = 'var(--border-color)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }
                  }}
                >
                  {loadingRole === role.id ? (
                    <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                  ) : (
                    <span>{role.icon}</span>
                  )}
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 32, lineHeight: 1.7 }}>
            By signing in you agree to our{' '}
            <span style={{ color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 500 }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 500 }}>Privacy Policy</span>
          </p>
        </div>
      </div>

      {/* ── Keyframe injection ──────────────────────────────── */}
      <style>{`
        @keyframes loginSpin {
          to { transform:rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/* ─── Shared input style ────────────────────────────────────── */
const inputStyle = {
  width: '100%',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 10,
  padding: '12px 14px 12px 42px',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
}
