import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RobCharacter from '../ROB/RobCharacter'

const CONFETTI_COLORS = ['#7B3FE4', '#9B6FF4', '#00D4FF', '#FFD700', '#FF7A2F', '#22C55E', '#EC4899']

function Particle({ x, color, delay }) {
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top: '-10px',
      width: 8, height: 8,
      borderRadius: Math.random() > 0.5 ? '50%' : 2,
      background: color,
      animation: `confettiFall ${1.8 + Math.random() * 1.2}s ${delay}s ease-in forwards`,
    }} />
  )
}

export default function RewardPopup({ xpEarned = 50, badgeName = 'Time Tamer', badgeEmoji = '⏰', robName, robColor = 'cyan', onContinue, onDashboard }) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [particles] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.8,
    }))
  )

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5,5,12,0.88)', backdropFilter: 'blur(10px)',
      opacity: visible ? 1 : 0, transition: 'opacity 0.4s',
    }}>
      {/* Confetti particles */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        {particles.map(p => (
          <Particle key={p.id} x={p.x} color={p.color} delay={p.delay} />
        ))}
      </div>

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 2,
        background: 'linear-gradient(145deg, #1A1A2E, #12121A)',
        border: '1px solid rgba(123,63,228,0.4)',
        borderRadius: 28,
        padding: '40px 44px',
        textAlign: 'center',
        maxWidth: 400, width: '90vw',
        boxShadow: '0 0 80px rgba(123,63,228,0.3), 0 40px 80px rgba(0,0,0,0.7)',
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(28px)',
        transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Glow ring */}
        <div style={{
          position: 'absolute', inset: -1, borderRadius: 28,
          background: 'linear-gradient(135deg, rgba(123,63,228,0.4), rgba(0,212,255,0.2), rgba(255,122,47,0.2))',
          zIndex: -1, filter: 'blur(1px)',
        }} />

        <div style={{ fontSize: 48, marginBottom: 4 }}>🎉</div>

        <div style={{
          fontSize: 12, fontWeight: 700, letterSpacing: 2.5,
          color: '#9B6FF4', textTransform: 'uppercase', marginBottom: 10,
        }}>
          Mission Complete!
        </div>

        <div style={{ marginBottom: 20 }}>
          <RobCharacter size="small" emotion="celebrating" color={robColor} />
        </div>

        {/* XP earned */}
        <div style={{
          fontSize: 64, fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, #FFD700, #FF7A2F)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 4,
          animation: 'xpPop 0.6s 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          +{xpEarned}
        </div>
        <div style={{
          fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20,
        }}>
          XP Earned!
        </div>

        {/* Badge */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,122,47,0.08))',
          border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: 16, padding: '16px 20px', marginBottom: 24,
          animation: 'fadeInUp 0.5s 0.5s ease both',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#FFD700', textTransform: 'uppercase', marginBottom: 8 }}>
            🏅 New Badge Unlocked
          </div>
          <div style={{ fontSize: 36, marginBottom: 6 }}>{badgeEmoji}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>{badgeName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
            Awarded for completing Module 1
          </div>
        </div>

        {/* Fun message */}
        <div style={{
          fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 24,
          animation: 'fadeInUp 0.5s 0.7s ease both',
        }}>
          {robName} is incredibly proud of you! You've taken your first step into the world of AI. 🚀
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10,
          animation: 'fadeInUp 0.5s 0.9s ease both',
        }}>
          <button
            onClick={onContinue}
            style={{
              background: 'linear-gradient(135deg, #7B3FE4, #5B2DB4)',
              border: 'none', borderRadius: 14, padding: '14px',
              color: '#fff', fontWeight: 800, fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(123,63,228,0.5)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(123,63,228,0.65)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(123,63,228,0.5)' }}
          >
            Continue to Module 2 →
          </button>

          <button
            onClick={onDashboard || (() => navigate('/dashboard/student'))}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, padding: '12px',
              color: 'var(--text-secondary)', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes xpPop {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
