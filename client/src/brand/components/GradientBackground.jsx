import { useEffect, useRef } from 'react'

const KEYFRAMES = `
@keyframes orbDrift1 {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(60px, -40px) scale(1.08); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes orbDrift2 {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(-50px, 60px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes orbDrift3 {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(40px, 30px) scale(0.95); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes gridFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`

export default function GradientBackground({ children, style }) {
  const injected = useRef(false)
  useEffect(() => {
    if (injected.current) return
    injected.current = true
    const tag = document.createElement('style')
    tag.textContent = KEYFRAMES
    document.head.appendChild(tag)
  }, [])

  return (
    <div style={{ position: 'relative', background: '#06040F', overflow: 'hidden', ...style }}>
      {/* Ambient orbs */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute',
          width: 900, height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,220,95,0.07) 0%, transparent 70%)',
          top: '-20%', left: '-15%',
          animation: 'orbDrift1 18s ease-in-out infinite',
          filter: 'blur(1px)',
        }} />
        <div style={{
          position: 'absolute',
          width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,63,228,0.08) 0%, transparent 70%)',
          top: '30%', right: '-10%',
          animation: 'orbDrift2 22s ease-in-out infinite',
          filter: 'blur(1px)',
        }} />
        <div style={{
          position: 'absolute',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          bottom: '-10%', left: '35%',
          animation: 'orbDrift3 16s ease-in-out infinite',
          filter: 'blur(1px)',
        }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'gridFade 2s ease-out forwards',
        }} />

        {/* Noise texture for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          opacity: 0.6,
        }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
