import { useState } from 'react'

const FLAME_SIZES = [
  { min: 0,  max: 0,  emoji: '💤', label: 'No streak yet', color: '#555577', bg: 'rgba(85,85,119,0.12)', border: 'rgba(85,85,119,0.25)' },
  { min: 1,  max: 1,  emoji: '🔥', label: 'Day 1 — just started!', color: '#FF7A2F', bg: 'rgba(255,122,47,0.12)', border: 'rgba(255,122,47,0.3)' },
  { min: 2,  max: 4,  emoji: '🔥', label: 'Building momentum!', color: '#FF7A2F', bg: 'rgba(255,122,47,0.15)', border: 'rgba(255,122,47,0.35)' },
  { min: 5,  max: 9,  emoji: '🔥🔥', label: "You're on fire!", color: '#FF5A00', bg: 'rgba(255,90,0,0.15)', border: 'rgba(255,90,0,0.4)' },
  { min: 10, max: 19, emoji: '🔥🔥🔥', label: 'Unstoppable!', color: '#FFD700', bg: 'rgba(255,215,0,0.12)', border: 'rgba(255,215,0,0.4)' },
  { min: 20, max: Infinity, emoji: '⚡🔥⚡', label: 'LEGENDARY streak!', color: '#FF00FF', bg: 'rgba(255,0,255,0.1)', border: 'rgba(255,0,255,0.35)' },
]

function getFlameStyle(days) {
  return FLAME_SIZES.find(s => days >= s.min && days <= s.max) || FLAME_SIZES[0]
}

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function StreakCard({ streakDays = 0, lastStreakDate = null, style = {} }) {
  const flame = getFlameStyle(streakDays)
  const [hovered, setHovered] = useState(false)

  // Build a 7-day visual where today and last N consecutive days are active
  const today = new Date()
  const weekData = WEEK_DAYS.map((day, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    const iso = d.toISOString().slice(0, 10)

    // Simple heuristic: mark days within streak range as active
    const daysAgo = 6 - i
    const active = lastStreakDate && daysAgo < streakDays && streakDays > 0

    return {
      label: day,
      date: iso,
      isToday: i === 6,
      active,
    }
  })

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: flame.bg,
        border: `1px solid ${flame.border}`,
        borderRadius: 20,
        padding: '20px 22px',
        boxShadow: hovered ? `0 0 30px ${flame.bg.replace('0.1', '0.3')}` : '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'all 0.3s',
        transform: hovered ? 'translateY(-2px)' : '',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        {/* Main streak display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            fontSize: 36, lineHeight: 1,
            animation: streakDays > 0 ? 'flamePulse 1.5s ease infinite' : 'none',
          }}>
            {flame.emoji}
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: flame.color, lineHeight: 1 }}>
              {streakDays}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginTop: 1 }}>
              Day{streakDays !== 1 ? 's' : ''} Streak
            </div>
          </div>
        </div>

        {/* Label badge */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, padding: '5px 12px',
          fontSize: 11, fontWeight: 700, color: flame.color,
          maxWidth: 130, textAlign: 'center',
        }}>
          {flame.label}
        </div>
      </div>

      {/* 7-day dot track */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {weekData.map((day, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: day.active ? 28 : 22,
              borderRadius: 8,
              background: day.isToday && streakDays > 0
                ? `linear-gradient(180deg, ${flame.color}, ${flame.color}AA)`
                : day.active
                  ? `${flame.color}55`
                  : 'rgba(255,255,255,0.06)',
              border: `1px solid ${day.isToday && streakDays > 0 ? flame.color : day.active ? `${flame.color}44` : 'rgba(255,255,255,0.06)'}`,
              boxShadow: day.isToday && streakDays > 0 ? `0 0 10px ${flame.color}80` : 'none',
              marginBottom: 4,
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12,
            }}>
              {day.isToday && streakDays > 0 ? '🔥' : day.active ? '✓' : ''}
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: day.isToday ? flame.color : 'var(--text-muted)',
            }}>
              {day.label}
            </div>
          </div>
        ))}
      </div>

      {/* Warning if streak at risk */}
      {streakDays > 0 && (
        <div style={{
          marginTop: 12,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 10, padding: '8px 12px',
          fontSize: 11, color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>⚡</span>
          <span>Come back tomorrow to keep your streak alive!</span>
        </div>
      )}

      <style>{`
        @keyframes flamePulse {
          0%, 100% { transform: scale(1) rotate(-3deg); }
          50% { transform: scale(1.1) rotate(3deg); }
        }
      `}</style>
    </div>
  )
}
