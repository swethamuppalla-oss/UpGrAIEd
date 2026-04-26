import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MODULE_ROUTES = {
  'L1M2': '/student/module/2',
  'L1M3': '/student/module/3',
  'L1M4': '/student/module/4',
}

export default function UnlockCard({
  moduleKey = 'L1M2',
  title = 'Better Questions, Better Answers',
  subtitle = 'Learn why better prompts give smarter AI answers.',
  xp = 60,
  duration = '12 min',
  icon = '💬',
  onStart,
  style = {},
}) {
  const navigate = useNavigate()
  const [glow, setGlow] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80)
    const t2 = setTimeout(() => setGlow(true), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleStart = () => {
    if (onStart) onStart(moduleKey)
    else if (MODULE_ROUTES[moduleKey]) navigate(MODULE_ROUTES[moduleKey])
    else window.alert(`Module ${moduleKey} coming soon!`)
  }

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(123,63,228,0.12) 60%, rgba(0,212,255,0.06) 100%)',
      border: `1px solid ${glow ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.15)'}`,
      borderRadius: 22,
      padding: '24px 24px',
      boxShadow: glow ? '0 0 40px rgba(0,212,255,0.15), 0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.3)',
      transition: 'all 0.8s cubic-bezier(0.34,1.3,0.64,1)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      ...style,
    }}>
      {/* Animated glow ring */}
      {glow && (
        <div style={{
          position: 'absolute', inset: -1,
          borderRadius: 22,
          background: 'linear-gradient(135deg, rgba(0,212,255,0.2), transparent, rgba(123,63,228,0.2))',
          animation: 'rotateBorder 4s linear infinite',
          zIndex: 0,
          pointerEvents: 'none',
        }} />
      )}

      {/* Ambient orb */}
      <div style={{
        position: 'absolute', width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
        top: -60, right: -40,
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Unlock badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            background: 'rgba(0,212,255,0.15)',
            border: '1px solid rgba(0,212,255,0.4)',
            borderRadius: 20, padding: '4px 14px',
            fontSize: 12, fontWeight: 800, color: '#00D4FF',
            display: 'flex', alignItems: 'center', gap: 6,
            animation: glow ? 'unlockPulse 2s ease infinite' : 'none',
          }}>
            🔓 New Module Unlocked
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: 16, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(123,63,228,0.2))',
            border: '1px solid rgba(0,212,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
            boxShadow: '0 4px 16px rgba(0,212,255,0.2)',
          }}>
            {icon}
          </div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 18, fontWeight: 900,
              color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 6,
            }}>
              {title}
            </div>
            <div style={{
              fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12,
            }}>
              {subtitle}
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { icon: '⏱', text: duration },
                { icon: '⚡', text: `+${xp} XP`, color: '#FFD700' },
                { icon: '🌱', text: 'Beginner' },
              ].map(m => (
                <div key={m.text} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8, padding: '4px 10px',
                  fontSize: 11, fontWeight: 600,
                  color: m.color || 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {m.icon} {m.text}
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleStart}
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #0099BB)',
                border: 'none', borderRadius: 14,
                padding: '12px 26px',
                color: '#000', fontWeight: 900, fontSize: 14,
                cursor: 'pointer', letterSpacing: 0.3,
                boxShadow: '0 4px 20px rgba(0,212,255,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,212,255,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,212,255,0.4)' }}
            >
              ▶ Start Module 2
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes unlockPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(0,212,255,0); }
        }
        @keyframes rotateBorder {
          from { opacity: 0.4; }
          50%  { opacity: 0.8; }
          to   { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
