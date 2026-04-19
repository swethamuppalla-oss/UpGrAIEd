import { useEffect, useRef, useState } from 'react'
import { useROB } from '../../context/RobContext'

const ROB_COLORS = {
  cyan: { primary: '#00D4FF', glow: 'rgba(0,212,255,0.35)' },
  purple: { primary: '#7B3FE4', glow: 'rgba(123,63,228,0.35)' },
  orange: { primary: '#FF5C28', glow: 'rgba(255,92,40,0.35)' },
  green: { primary: '#22C55E', glow: 'rgba(34,197,94,0.35)' },
  pink: { primary: '#EC4899', glow: 'rgba(236,73,153,0.35)' },
}

const COLOR_OPTIONS = [
  { id: 'cyan', label: 'Cyber Blue' },
  { id: 'purple', label: 'Cosmic Purple' },
  { id: 'orange', label: 'Blaze Orange' },
  { id: 'green', label: 'Matrix Green' },
  { id: 'pink', label: 'Neon Pink' },
]

const SUGGESTED_NAMES = ['Sparky', 'Nova', 'Bolt', 'Pixel', 'Byte', 'Neo', 'Zara', 'Flux']

function getRandomName() {
  return SUGGESTED_NAMES[Math.floor(Math.random() * SUGGESTED_NAMES.length)]
}

export default function RobOnboardingModal({ visible, onComplete }) {
  const { setRobName, robColor } = useROB()
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState('cyan')
  const [saving, setSaving] = useState(false)
  const [chestAnim, setChestAnim] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }, [visible])

  const handleSurpriseMe = () => {
    const n = getRandomName()
    setName(n)
    setChestAnim(true)
    setTimeout(() => setChestAnim(false), 700)
  }

  const handleSave = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    setSaving(true)
    await setRobName(trimmed, selectedColor)
    setTimeout(() => {
      setSaving(false)
      onComplete(trimmed)
    }, 600)
  }

  const colors = ROB_COLORS[selectedColor] || ROB_COLORS.cyan
  const displayName = name.trim().toUpperCase() || '?????'

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes robModalIn {
          from { transform: scale(0.88) translateY(32px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes robWave {
          0%,100% { transform: rotate(0deg); }
          20% { transform: rotate(-22deg); }
          60% { transform: rotate(18deg); }
        }
        @keyframes chestFlash {
          0%,100% { filter: none; }
          50% { filter: drop-shadow(0 0 12px ${colors.primary}); }
        }
        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0); opacity: 1; }
          100% { transform: translateY(-80px) translateX(var(--dx,10px)); opacity: 0; }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}>
        <div style={{
          width: 'min(100%, 520px)',
          background: 'linear-gradient(145deg, #0F0B1C, #1A1430)',
          border: `1px solid ${colors.glow}`,
          borderRadius: 28,
          padding: '40px 36px',
          animation: 'robModalIn 0.45s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 60px ${colors.glow}`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background glow blob */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 280, height: 280,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* ROB Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, position: 'relative' }}>
            {/* Particles on chest anim */}
            {chestAnim && [0,1,2,3].map(i => (
              <div key={i} style={{
                position: 'absolute',
                bottom: '40%',
                left: `${40 + i * 6}%`,
                width: 6, height: 6,
                borderRadius: '50%',
                background: colors.primary,
                '--dx': `${(i - 1.5) * 20}px`,
                animation: 'floatParticle 0.7s ease forwards',
              }} />
            ))}

            {/* Inline SVG ROB mascot */}
            <svg viewBox="0 0 200 260" width={150} style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="onbHeadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={colors.primary} stopOpacity="0.55" />
                </linearGradient>
                <linearGradient id="onbBodyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0099BB" />
                  <stop offset="100%" stopColor="#005F77" />
                </linearGradient>
              </defs>

              {/* Antenna */}
              <line x1="100" y1="20" x2="100" y2="4" stroke="#00AABB" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="0" r="6" fill={colors.primary}
                style={{ filter: `drop-shadow(0 0 8px ${colors.primary})`, animation: 'robAntennaPulse 1.5s ease-in-out infinite' }} />

              {/* Head */}
              <rect x="40" y="20" width="120" height="100" rx="24" fill="url(#onbHeadGrad)" />
              <circle cx="75" cy="65" r="14" fill="white" />
              <circle cx="125" cy="65" r="14" fill="white" />
              <circle cx="75" cy="65" r="8" fill="#1a1a2e" />
              <circle cx="125" cy="65" r="8" fill="#1a1a2e" />
              <circle cx="79" cy="61" r="3" fill="white" />
              <circle cx="129" cy="61" r="3" fill="white" />
              {/* Smile */}
              <path d="M 78 90 Q 100 108 122 90" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />

              {/* Neck */}
              <rect x="85" y="118" width="30" height="16" rx="6" fill="#0099BB" />

              {/* Body */}
              <rect x="50" y="130" width="100" height="80" rx="16" fill="url(#onbBodyGrad)" />

              {/* Chest screen */}
              <rect x="65" y="144" width="70" height="44" rx="10" fill="rgba(0,15,25,0.7)" stroke={colors.primary}
                strokeWidth="1.5" strokeOpacity="0.6"
                style={{ animation: chestAnim ? 'chestFlash 0.7s ease' : undefined }} />

              {/* ROB name on chest */}
              <text x="100" y="171" textAnchor="middle" fill={colors.primary}
                fontSize="11" fontFamily="'Inter', monospace" fontWeight="700" letterSpacing="2">
                {displayName.length > 7 ? displayName.slice(0, 7) : displayName}
              </text>

              {/* Arms — waving */}
              <g style={{ transformOrigin: '42px 142px', transformBox: 'fill-box', animation: 'robWave 1.4s ease-in-out infinite' }}>
                <rect x="18" y="136" width="28" height="12" rx="6" fill="#0099BB" />
              </g>
              <rect x="154" y="136" width="28" height="12" rx="6" fill="#0099BB" />

              {/* Legs */}
              <rect x="68" y="210" width="22" height="36" rx="8" fill="#0088AA" />
              <rect x="110" y="210" width="22" height="36" rx="8" fill="#0088AA" />
              <ellipse cx="79" cy="246" rx="16" ry="8" fill="#006688" />
              <ellipse cx="121" cy="246" rx="16" ry="8" fill="#006688" />
            </svg>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div className="clash-display" style={{ fontSize: 26, marginBottom: 6 }}>
              🤖 Meet Your AI Learning Buddy
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Before we begin, what would you like to name your ROB?
            </p>
          </div>

          {/* Name input */}
          <div style={{ marginBottom: 16 }}>
            <input
              ref={inputRef}
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Enter ROB name..."
              maxLength={20}
              style={{ fontSize: 18, textAlign: 'center', fontWeight: 700, letterSpacing: 1 }}
            />
          </div>

          {/* Suggested names */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            {SUGGESTED_NAMES.slice(0, 6).map(n => (
              <button key={n} type="button" onClick={() => setName(n)}
                style={{
                  borderRadius: 999, border: `1px solid ${name === n ? colors.primary : 'rgba(255,255,255,0.1)'}`,
                  padding: '6px 14px', background: name === n ? `${colors.glow}` : 'rgba(255,255,255,0.04)',
                  color: name === n ? colors.primary : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                }}>
                {n}
              </button>
            ))}
          </div>

          {/* Color picker */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
              ROB Color Theme
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              {COLOR_OPTIONS.map(c => {
                const col = ROB_COLORS[c.id]
                return (
                  <button key={c.id} type="button" onClick={() => setSelectedColor(c.id)}
                    title={c.label}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: col.primary,
                      border: selectedColor === c.id ? `3px solid white` : '3px solid transparent',
                      cursor: 'pointer',
                      boxShadow: selectedColor === c.id ? `0 0 12px ${col.glow}` : 'none',
                      transition: 'all 0.2s',
                    }} />
                )
              })}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="btn-ghost" onClick={handleSurpriseMe} style={{ flex: 1 }}>
              🎲 Surprise Me
            </button>
            <button type="button" className="btn-primary" onClick={handleSave}
              disabled={!name.trim() || saving}
              style={{ flex: 2, background: `linear-gradient(135deg, ${colors.primary}, #7B3FE4)` }}>
              {saving ? '✨ Setting up...' : 'Save & Start Mission →'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
