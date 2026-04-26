import { useState } from 'react'
import RobCharacter from '../ROB/RobCharacter'

const COMEBACK_MESSAGES = [
  'missed your missions!',
  'has been waiting for you!',
  'saved a special quiz just for you!',
  'kept your progress warm ❤️',
]

export default function RobComebackCard({ robName = 'ROB', robColor = 'cyan', daysMissed = 2, onQuickQuiz, onResume, style = {} }) {
  const [dismissed, setDismissed] = useState(false)
  const msgIdx = Math.min(daysMissed - 2, COMEBACK_MESSAGES.length - 1)
  const message = COMEBACK_MESSAGES[Math.max(0, msgIdx)]

  if (dismissed) return null

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(236,73,153,0.1) 0%, rgba(123,63,228,0.12) 50%, rgba(0,212,255,0.07) 100%)',
      border: '1px solid rgba(236,73,153,0.3)',
      borderRadius: 22, padding: '22px 24px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: 'slideInDown 0.5s cubic-bezier(0.34,1.3,0.64,1)',
      ...style,
    }}>
      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, width: 28, height: 28,
          color: 'var(--text-muted)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700,
        }}
      >
        ×
      </button>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,73,153,0.15) 0%, transparent 70%)',
        top: -40, right: 80, pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        {/* ROB with pulsing glow ring */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            position: 'absolute', inset: -8, borderRadius: '50%',
            border: '2px solid rgba(236,73,153,0.4)',
            animation: 'glowPing 1.8s ease infinite',
          }} />
          <RobCharacter size="small" emotion="sad" color={robColor} />
        </div>

        {/* Message */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            color: '#EC4899', textTransform: 'uppercase', marginBottom: 5,
          }}>
            👀 {daysMissed > 1 ? `${daysMissed} days missed` : 'You were away'}
          </div>
          <div style={{
            fontSize: 17, fontWeight: 900,
            color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4,
          }}>
            {robName} {message}
          </div>
          <div style={{
            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
          }}>
            Your streak is at risk. Jump back in — just 5 minutes keeps the flame alive!
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <button
            onClick={onQuickQuiz}
            style={{
              background: 'linear-gradient(135deg, #EC4899, #BE185D)',
              border: 'none', borderRadius: 12,
              padding: '11px 20px',
              color: '#fff', fontWeight: 800, fontSize: 13,
              cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(236,73,153,0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = '' }}
          >
            ⚡ Quick Comeback Quiz
          </button>
          <button
            onClick={onResume}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12, padding: '10px 20px',
              color: 'var(--text-secondary)', fontWeight: 700, fontSize: 13,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            ▶ Resume Journey
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPing {
          0%   { transform: scale(1);   opacity: 0.6; }
          60%  { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1);   opacity: 0; }
        }
      `}</style>
    </div>
  )
}
