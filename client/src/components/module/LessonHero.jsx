import { useEffect, useState } from 'react'
import RobCharacter from '../ROB/RobCharacter'

const THOUGHTS = [
  'Ready to save your day? 🚀',
  'Want bonus XP today? ⚡',
  "Let's become smarter together! 🧠",
  'AI is your superpower! 💡',
  'You\'ve got this, champion! 🏆',
]

export default function LessonHero({ robName, robColor = 'cyan', onStartLesson, onAskRob, xpReward = 50 }) {
  const [thoughtIdx, setThoughtIdx] = useState(0)
  const [thoughtVisible, setThoughtVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtVisible(false)
      setTimeout(() => {
        setThoughtIdx(i => (i + 1) % THOUGHTS.length)
        setThoughtVisible(true)
      }, 350)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(123,63,228,0.15) 0%, rgba(0,212,255,0.08) 50%, rgba(255,122,47,0.06) 100%)',
      border: '1px solid rgba(123,63,228,0.3)',
      borderRadius: 24, padding: '36px 40px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
    }}>
      {/* Background glow orbs */}
      <div style={{
        position: 'absolute', width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,63,228,0.12) 0%, transparent 70%)',
        top: -80, right: 120, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.09) 0%, transparent 70%)',
        bottom: -40, left: 60, pointerEvents: 'none',
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 32, alignItems: 'center',
        position: 'relative', zIndex: 1,
      }}>
        {/* LEFT: Content */}
        <div>
          {/* Module badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{
              background: 'rgba(123,63,228,0.2)',
              border: '1px solid rgba(123,63,228,0.4)',
              borderRadius: 20, padding: '4px 14px',
              fontSize: 12, fontWeight: 700, color: '#9B6FF4',
              letterSpacing: 0.5,
            }}>
              Level 1 · Module 1
            </div>
            <div style={{
              background: 'rgba(255,215,0,0.12)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: 20, padding: '4px 12px',
              fontSize: 12, fontWeight: 700, color: '#FFD700',
            }}>
              ⚡ +{xpReward} XP
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(26px, 3vw, 38px)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: 12,
            color: 'var(--text-primary)',
            letterSpacing: -0.5,
          }}>
            {robName} Saves Your<br />
            <span style={{
              background: 'linear-gradient(135deg, #9B6FF4, #00D4FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Day with AI
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 15, color: 'var(--text-secondary)',
            lineHeight: 1.7, maxWidth: 480, marginBottom: 24,
          }}>
            Learn how smart students use AI to plan better — homework, play, sleep and beyond. Your first step to becoming an AI Champion.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
            {[
              { icon: '⏱', label: '8–10 min' },
              { icon: '🎯', label: '4 quizzes' },
              { icon: '🌱', label: 'Beginner' },
              { icon: '🏅', label: '1 badge' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600,
              }}>
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={onStartLesson}
              style={{
                background: 'linear-gradient(135deg, #7B3FE4, #5B2DB4)',
                border: 'none', borderRadius: 14,
                padding: '14px 30px',
                color: '#fff', fontWeight: 800, fontSize: 15,
                cursor: 'pointer', letterSpacing: 0.3,
                boxShadow: '0 4px 24px rgba(123,63,228,0.5)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(123,63,228,0.65)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(123,63,228,0.5)' }}
            >
              ▶ Start Lesson
            </button>

            <button
              onClick={onAskRob}
              style={{
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.35)',
                borderRadius: 14, padding: '14px 24px',
                color: '#00D4FF', fontWeight: 700, fontSize: 15,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)' }}
            >
              🤖 Ask {robName}
            </button>
          </div>
        </div>

        {/* RIGHT: ROB avatar */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 12, flexShrink: 0,
        }}>
          {/* Thought bubble */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 16, padding: '10px 16px',
            fontSize: 12, fontWeight: 700, color: '#1A1A26',
            maxWidth: 200, textAlign: 'center', lineHeight: 1.4,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            position: 'relative',
            opacity: thoughtVisible ? 1 : 0,
            transform: thoughtVisible ? 'translateY(0) scale(1)' : 'translateY(4px) scale(0.97)',
            transition: 'opacity 0.3s, transform 0.3s',
          }}>
            {THOUGHTS[thoughtIdx]}
            {/* Triangle pointer */}
            <div style={{
              position: 'absolute', bottom: -8, left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid rgba(255,255,255,0.95)',
            }} />
          </div>

          <div style={{ animation: 'robGentleFloat 4s ease-in-out infinite' }}>
            <RobCharacter
              size="large"
              emotion="excited"
              color={robColor}
              chestLabel={robName}
              showChestName
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes robGentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 700px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
