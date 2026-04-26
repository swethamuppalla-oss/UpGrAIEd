import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RobCharacter from '../ROB/RobCharacter'

// ─── Confetti particle ────────────────────────────────────────────────────────

const PALETTE = ['#7B3FE4', '#9B6FF4', '#00D4FF', '#FFD700', '#FF7A2F', '#22C55E', '#EC4899', '#F0F0FF']

function makeParticles(count = 48) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    size: 6 + Math.random() * 8,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    delay: Math.random() * 0.6,
    duration: 1.6 + Math.random() * 1.2,
    rotate: Math.random() * 720,
    shape: Math.random() > 0.4 ? 'rect' : 'circle',
    drift: (Math.random() - 0.5) * 60,
  }))
}

function Confetti() {
  const [particles] = useState(makeParticles)

  return (
    <div style={{
      position: 'absolute', inset: 0,
      overflow: 'hidden', borderRadius: 'inherit',
      pointerEvents: 'none', zIndex: 0,
    }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: -12,
          width: p.size, height: p.shape === 'rect' ? p.size * 0.4 : p.size,
          borderRadius: p.shape === 'circle' ? '50%' : 3,
          background: p.color,
          animation: `confettiFall ${p.duration}s ${p.delay}s ease-in both`,
          '--drift': `${p.drift}px`,
          '--rotate': `${p.rotate}deg`,
        }} />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0)     translateX(0)          rotate(0deg);   opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translateY(400px) translateX(var(--drift)) rotate(var(--rotate)); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ─── Animated number ──────────────────────────────────────────────────────────

function CountUp({ to, duration = 1600 }) {
  const [val, setVal] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      setVal(Math.round(to * eased))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    const id = setTimeout(() => { raf.current = requestAnimationFrame(tick) }, 600)
    return () => { clearTimeout(id); cancelAnimationFrame(raf.current) }
  }, [to, duration])

  return <>{val}</>
}

// ─── Badge reveal card ────────────────────────────────────────────────────────

function BadgeReveal({ emoji, name, delay = 0.8 }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), delay * 1000)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,122,47,0.08))',
      border: `1px solid ${revealed ? 'rgba(255,215,0,0.5)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 20, padding: '18px 24px',
      transition: 'all 0.6s cubic-bezier(0.34,1.3,0.64,1)',
      transform: revealed ? 'scale(1)' : 'scale(0.85)',
      opacity: revealed ? 1 : 0,
      boxShadow: revealed ? '0 0 30px rgba(255,215,0,0.2)' : 'none',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 2,
        color: '#FFD700', textTransform: 'uppercase', marginBottom: 10,
      }}>
        🏅 Badge Unlocked
      </div>
      <div style={{
        fontSize: 44, marginBottom: 8,
        filter: revealed ? 'none' : 'blur(8px)',
        transition: 'filter 0.5s 0.2s',
      }}>
        {emoji}
      </div>
      <div style={{
        fontSize: 18, fontWeight: 900,
        color: 'var(--text-primary)', marginBottom: 4,
      }}>
        {name}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        Module 1 Complete
      </div>
    </div>
  )
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function CompletionModal({
  xpEarned = 50,
  totalXP = 50,
  badgeName = 'Time Tamer',
  badgeEmoji = '⏰',
  streakDays = 1,
  robName = 'ROB',
  robColor = 'cyan',
  nextModuleTitle = 'Better Questions, Better Answers',
  onContinue,
  onDashboard,
}) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)

  // Staggered reveal phases
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1300),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5,5,12,0.90)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      opacity: phase >= 1 ? 1 : 0,
      transition: 'opacity 0.4s',
    }}>
      {/* Card */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(145deg, #1A1A2E 0%, #12121A 60%, #0F0B1C 100%)',
        border: '1px solid rgba(123,63,228,0.45)',
        borderRadius: 28,
        padding: '40px 40px 36px',
        maxWidth: 440, width: '92vw',
        maxHeight: '92vh', overflowY: 'auto',
        boxShadow: '0 0 100px rgba(123,63,228,0.25), 0 40px 80px rgba(0,0,0,0.8)',
        transform: phase >= 1 ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(30px)',
        transition: 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
        zIndex: 1,
      }}>
        <Confetti />

        {/* Content (above confetti) */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Top emoji */}
          <div style={{
            textAlign: 'center', marginBottom: 6,
            fontSize: 52, lineHeight: 1,
            animation: phase >= 1 ? 'popIn 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
          }}>
            🎉
          </div>

          {/* Headline */}
          <div style={{
            textAlign: 'center', marginBottom: 20,
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.5s 0.2s',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 2.5,
              color: '#9B6FF4', textTransform: 'uppercase', marginBottom: 8,
            }}>
              Mission Complete!
            </div>
            <div style={{
              fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2,
            }}>
              You crushed it, champion!
            </div>
          </div>

          {/* ROB */}
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: 20,
            opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.5s 0.3s',
          }}>
            <RobCharacter size="small" emotion="celebrating" color={robColor} showSpeech
              speechText={`Amazing work, ${robName}! 🚀`} />
          </div>

          {/* XP earned */}
          <div style={{
            textAlign: 'center', marginBottom: 20,
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'scale(1)' : 'scale(0.8)',
            transition: 'all 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
              You earned
            </div>
            <div style={{
              fontSize: 68, fontWeight: 900, lineHeight: 1,
              background: 'linear-gradient(135deg, #FFD700 0%, #FF7A2F 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5))',
            }}>
              +<CountUp to={xpEarned} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              XP
            </div>

            {/* Total XP */}
            <div style={{
              marginTop: 10,
              background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.2)',
              borderRadius: 10, padding: '6px 16px',
              display: 'inline-block',
              fontSize: 13, fontWeight: 700, color: '#FFD700',
            }}>
              Total: <CountUp to={totalXP} /> XP
            </div>
          </div>

          {/* Streak */}
          {streakDays > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginBottom: 20,
              opacity: phase >= 2 ? 1 : 0,
              transition: 'opacity 0.4s 0.3s',
            }}>
              <div style={{
                background: 'rgba(255,122,47,0.15)',
                border: '1px solid rgba(255,122,47,0.35)',
                borderRadius: 12, padding: '8px 18px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 20 }}>🔥</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#FF7A2F' }}>
                    {streakDays} Day Streak
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    Keep it going!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Badge */}
          <div style={{ marginBottom: 24 }}>
            <BadgeReveal emoji={badgeEmoji} name={badgeName} delay={0.9} />
          </div>

          {/* Next module preview */}
          {nextModuleTitle && (
            <div style={{
              background: 'rgba(0,212,255,0.07)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 16, padding: '14px 18px',
              marginBottom: 24,
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.5s 0.1s',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#00D4FF', marginBottom: 6, letterSpacing: 1 }}>
                🔓 NEXT UP — MODULE 2
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {nextModuleTitle}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                +60 XP · Unlock with this completion
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            opacity: phase >= 3 ? 1 : 0,
            transition: 'opacity 0.4s 0.2s',
          }}>
            <button
              onClick={onContinue}
              style={{
                background: 'linear-gradient(135deg, #7B3FE4, #5B2DB4)',
                border: 'none', borderRadius: 16, padding: '16px',
                color: '#fff', fontWeight: 900, fontSize: 15,
                cursor: 'pointer', letterSpacing: 0.3,
                boxShadow: '0 4px 28px rgba(123,63,228,0.55)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 36px rgba(123,63,228,0.7)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 28px rgba(123,63,228,0.55)' }}
            >
              🚀 Continue to Module 2
            </button>

            <button
              onClick={onDashboard || (() => navigate('/dashboard/student'))}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: '13px',
                color: 'var(--text-secondary)', fontWeight: 700, fontSize: 14,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.4) rotate(-15deg); opacity: 0; }
          to   { transform: scale(1)   rotate(0deg);   opacity: 1; }
        }
      `}</style>
    </div>
  )
}
