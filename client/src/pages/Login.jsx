import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { demoLogin as demoLoginRequest, login as loginRequest } from '../services/authService'
import { trackEvent, identifyUser, EVENTS } from '../utils/analytics'

/* ─── Route map ─────────────────────────────────────────────── */
const ROLE_ROUTES = {
  student: '/dashboard/student',
  parent:  '/dashboard/parent',
  admin:   '/dashboard/admin',
  creator: '/dashboard/creator',
}

/* ─── Demo role config ──────────────────────────────────────── */
const DEMO_ROLES = [
  {
    id: 'parent',
    icon: '👨‍👩‍👧',
    label: 'Parent',
    tagline: 'Family Portal',
    description: 'View child progress, subscribe & manage account',
    gradient: 'linear-gradient(135deg, #FF7A2F 0%, #FF4E8A 100%)',
    glow: 'rgba(255,122,47,0.35)',
    border: 'rgba(255,122,47,0.4)',
    token: 'demo-token-parent',
  },
  {
    id: 'student',
    icon: '🎓',
    label: 'Student',
    tagline: 'Learning Portal',
    description: 'Continue learning, complete modules & earn badges',
    gradient: 'linear-gradient(135deg, #7B3FE4 0%, #3B82F6 100%)',
    glow: 'rgba(123,63,228,0.35)',
    border: 'rgba(123,63,228,0.4)',
    token: 'demo-token-student',
  },
  {
    id: 'admin',
    icon: '🛠️',
    label: 'Admin',
    tagline: 'Control Center',
    description: 'Manage users, content, payments & analytics',
    gradient: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)',
    glow: 'rgba(16,185,129,0.35)',
    border: 'rgba(16,185,129,0.4)',
    token: 'demo-token-admin',
  },
  {
    id: 'creator',
    icon: '🎬',
    label: 'Creator',
    tagline: 'Studio Portal',
    description: 'Upload materials, manage videos & review submissions',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    glow: 'rgba(236,72,153,0.35)',
    border: 'rgba(236,72,153,0.4)',
    token: 'demo-token-creator',
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
      window.location.href = '/upgraied'
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="dark-surface" style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', -apple-system, sans-serif",
      overflow: 'hidden',
      position: 'relative',
    }}>
      <button
        onClick={() => navigate('/')}
        className="bloom-btn-ghost"
        style={{
          position: 'absolute', top: 24, left: 32, zIndex: 10,
          padding: '8px 16px', fontSize: 14, color: 'var(--text-secondary)'
        }}
      >
        ← Back to Home
      </button>

      {/* ── Global ambient orbs ─────────────────────────────── */}
      <Orb style={{ width: 700, height: 700, background: 'rgba(123,63,228,0.12)', top: -200, left: -200 }} />
      <Orb style={{ width: 500, height: 500, background: 'rgba(255,122,47,0.08)', bottom: -100, right: 200 }} />
      <Orb style={{ width: 300, height: 300, background: 'rgba(236,72,153,0.08)', top: '40%', left: '35%' }} />

      {/* ══════════════ LEFT BRANDING PANEL ══════════════════ */}
      <div style={{
        flex: '0 0 420px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 52px',
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(-30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        {/* Panel gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(160deg, rgba(123,63,228,0.06) 0%, rgba(255,122,47,0.04) 50%, rgba(236,72,153,0.04) 100%)',
        }} />

        {/* Logo */}
        <div style={{ marginBottom: 48, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: '10px 16px',
            marginBottom: 32,
          }}>
            <span style={{ fontSize: 22 }}>🧠</span>
            <span style={{
              fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #C084FC, #FF7A2F)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>UpgrAIed</span>
          </div>

          <h1 style={{
            fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em',
            lineHeight: 1.15, color: 'var(--text-inverse)', marginBottom: 16,
          }}>
            Build.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #C084FC 0%, #FF7A2F 50%, #EC4899 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Learn.</span>
            {' '}Earn<br />with AI.
          </h1>

          <p style={{ color: '#8888AA', fontSize: 15, lineHeight: 1.7, maxWidth: 300 }}>
            A next-generation learning platform for students, parents, creators and administrators.
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
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
              transition: `opacity 0.5s ${0.2 + i * 0.08}s ease, transform 0.5s ${0.2 + i * 0.08}s ease`,
            }}>
              <span style={{ fontSize: 16 }}>{f.icon}</span>
              <span style={{ color: '#A0A0C0', fontSize: 13, fontWeight: 500 }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <p style={{
          marginTop: 40, color: '#555577', fontSize: 12,
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
        {/* Demo Access badge — top right */}
        <div style={{
          position: 'absolute', top: 24, right: 24,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 99, padding: '5px 12px',
          fontSize: 11, fontWeight: 700, color: '#22C55E',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#22C55E',
            boxShadow:'0 0 8px #22C55E', animation:'loginPulse 1.5s infinite' }} />
          Demo Access Enabled
        </div>

        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: 'left' }}>
            <h2 style={{
              fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--text-inverse)', marginBottom: 8,
            }}>Welcome Back 👋</h2>
            <p style={{ color: '#8888AA', fontSize: 14 }}>
              Choose your role for instant demo access — or sign in with your credentials below.
            </p>
          </div>

          {/* Section label */}
          <SectionLabel>One-Click Demo Login</SectionLabel>

          {/* ─── Role cards grid ─────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 28,
          }}>
            {DEMO_ROLES.map((role, i) => (
              <RoleCard
                key={role.id}
                role={role}
                isHovered={hoveredRole === role.id}
                isActive={activeRole === role.id}
                isLoading={loadingRole === role.id}
                delay={i * 0.07}
                mounted={mounted}
                onHover={() => setHoveredRole(role.id)}
                onLeave={() => setHoveredRole(null)}
                onClick={() => handleDemoLogin(role)}
              />
            ))}
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 24,
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: '#555577', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
              or sign in with email
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Section label */}
          <SectionLabel>Secure Login</SectionLabel>

          {/* ─── Manual login form ───────────────────────────── */}
          <form onSubmit={handleManualLogin}>
            {formError && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
                color: '#FCA5A5', fontSize: 13,
              }}>
                <span>⚠️</span> {formError}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: '#8888AA', marginBottom: 7, letterSpacing: '0.04em', textTransform: 'uppercase',
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
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: '#8888AA', marginBottom: 7, letterSpacing: '0.04em', textTransform: 'uppercase',
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
                    color: '#555577', fontSize: 16, padding: 4, borderRadius: 6,
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
              style={{
                width: '100%', padding: '13px 20px',
                background: formLoading
                  ? 'rgba(123,63,228,0.5)'
                  : 'linear-gradient(135deg, #7B3FE4 0%, #3B82F6 100%)',
                border: 'none', borderRadius: 12,
                color: 'var(--text-inverse)', fontSize: 15, fontWeight: 700,
                cursor: formLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
                boxShadow: formLoading ? 'none' : '0 4px 20px rgba(123,63,228,0.4)',
                fontFamily: 'inherit',
                letterSpacing: '0.01em',
              }}
            >
              {formLoading ? (
                <>
                  <span className="spinner" />
                  Signing in…
                </>
              ) : (
                <>Secure Login →</>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', color: '#444466', fontSize: 12, marginTop: 20, lineHeight: 1.7 }}>
            By signing in you agree to our{' '}
            <span style={{ color: '#7B3FE4', cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: '#7B3FE4', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>

      {/* ── Keyframe injection ──────────────────────────────── */}
      <style>{`
        @keyframes loginPulse {
          0%,100% { opacity:1; box-shadow:0 0 8px #22C55E; }
          50%      { opacity:0.5; box-shadow:0 0 3px #22C55E; }
        }
        @keyframes loginSpin {
          to { transform:rotate(360deg); }
        }
        @keyframes loginCardFloat {
          0%,100% { transform:translateY(0px) scale(1.01); }
          50%      { transform:translateY(-4px) scale(1.01); }
        }
      `}</style>
    </div>
  )
}

/* ─── Section label ─────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
    }}>
      <div style={{ width: 3, height: 14, background: 'linear-gradient(180deg,#7B3FE4,#EC4899)', borderRadius: 99 }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: '#666688', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {children}
      </span>
    </div>
  )
}

/* ─── Role card ─────────────────────────────────────────────── */
function RoleCard({ role, isHovered, isActive, isLoading, delay, mounted, onHover, onLeave, onClick }) {
  return (
    <button
      id={`demo-login-${role.id}`}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      disabled={!!isLoading}
      style={{
        position: 'relative',
        background: isHovered || isActive
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(255,255,255,0.025)',
        border: isActive
          ? `1.5px solid ${role.border}`
          : isHovered
            ? `1.5px solid ${role.border}`
            : '1.5px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: '18px 16px',
        cursor: isLoading ? 'default' : 'pointer',
        textAlign: 'left',
        transition: 'all 0.22s ease',
        transform: isHovered && !isLoading ? 'translateY(-3px) scale(1.01)' : 'none',
        boxShadow: isHovered || isActive
          ? `0 8px 30px ${role.glow}`
          : '0 2px 10px rgba(0,0,0,0.2)',
        animation: isActive ? 'loginCardFloat 1.2s ease-in-out infinite' : 'none',
        fontFamily: 'inherit',
        overflow: 'hidden',

        /* entrance */
        opacity: mounted ? 1 : 0,
        marginTop: mounted ? 0 : 8,
      }}
      aria-label={`${role.label} demo login`}
    >
      {/* gradient shimmer on hover */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 16, pointerEvents: 'none',
        background: role.gradient,
        opacity: isHovered || isActive ? 0.08 : 0,
        transition: 'opacity 0.22s ease',
      }} />

      {/* top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        {/* icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: role.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
          boxShadow: `0 4px 14px ${role.glow}`,
          transition: 'transform 0.2s',
          transform: isHovered ? 'scale(1.1) rotate(-3deg)' : 'none',
        }}>
          {role.icon}
        </div>

        {/* loading spinner or arrow */}
        <div style={{
          width: 24, height: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isLoading ? (
            <div style={{
              width: 16, height: 16,
              border: '2px solid rgba(255,255,255,0.15)',
              borderTopColor: 'var(--text-inverse)',
              borderRadius: '50%',
              animation: 'loginSpin 0.7s linear infinite',
            }} />
          ) : (
            <span style={{
              fontSize: 14, color: isHovered ? 'var(--text-inverse)' : '#444466',
              transition: 'all 0.2s',
              transform: isHovered ? 'translate(2px, -2px)' : 'none',
              display: 'block',
            }}>↗</span>
          )}
        </div>
      </div>

      {/* label */}
      <div style={{
        fontSize: 15, fontWeight: 700, color: 'var(--text-inverse)', marginBottom: 2,
        letterSpacing: '-0.01em',
      }}>
        {role.label}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: isHovered ? '#A080F0' : '#555577',
        textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8,
        transition: 'color 0.2s',
      }}>
        {role.tagline}
      </div>
      <div style={{ fontSize: 12, color: '#7070A0', lineHeight: 1.5 }}>
        {role.description}
      </div>
    </button>
  )
}

/* ─── Shared input style ────────────────────────────────────── */
const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  padding: '11px 14px 11px 42px',
  color: 'var(--text-inverse)',
  fontFamily: 'inherit',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
}
