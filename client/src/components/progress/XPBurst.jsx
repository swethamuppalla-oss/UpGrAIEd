import { useEffect, useRef, useState } from 'react'

// Animated XP counter that ticks up from 0 to target
function CountUp({ from = 0, to, duration = 1400, suffix = '' }) {
  const [value, setValue] = useState(from)
  const raf = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const range = to - from

    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(from + range * eased))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [from, to, duration])

  return <>{value}{suffix}</>
}

// Floating +XP label that animates upward
function FloatingLabel({ xp, x, y, color = '#FFD700', onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onDone?.() }, 1100)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed',
      left: x, top: y,
      transform: 'translateX(-50%)',
      fontSize: 18, fontWeight: 900,
      color,
      pointerEvents: 'none',
      zIndex: 9990,
      opacity: visible ? 1 : 0,
      animation: 'xpFloat 1.1s ease forwards',
      textShadow: `0 0 12px ${color}`,
    }}>
      +{xp} XP
    </div>
  )
}

// Main XP display bar — shows current XP with animated fill
export function XPBar({ current, max = 200, label = 'Level XP', color = '#7B3FE4' }) {
  const pct = Math.min(Math.round((current / max) * 100), 100)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color }}>
          <CountUp to={current} /> / {max} XP
        </span>
      </div>
      <div style={{
        height: 8, borderRadius: 99,
        background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          height: '100%', borderRadius: 99,
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}AA)`,
          boxShadow: `0 0 12px ${color}80`,
          transition: 'width 1.2s cubic-bezier(0.34,1.3,0.64,1)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Shimmer sweep */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
            animation: 'shimmerSweep 2s ease infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes xpFloat {
          0% { opacity: 0; transform: translateX(-50%) translateY(0) scale(0.7); }
          20% { opacity: 1; transform: translateX(-50%) translateY(-12px) scale(1.1); }
          80% { opacity: 1; transform: translateX(-50%) translateY(-36px) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-52px) scale(0.9); }
        }
        @keyframes shimmerSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}

// Circular XP ring progress
export function XPRing({ xp = 0, maxXP = 200, level = 1, size = 120, color = '#7B3FE4' }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(xp / maxXP, 1)
  const offset = circumference * (1 - pct)

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={8} />
        {/* Fill */}
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.3,0.64,1)', filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      {/* Center label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>LVL</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{level}</div>
        <div style={{ fontSize: 10, fontWeight: 600, color }}>
          <CountUp to={xp} />/{maxXP}
        </div>
      </div>
    </div>
  )
}

// Exported FloatingLabel for external use
export { FloatingLabel, CountUp }
export default XPBar
