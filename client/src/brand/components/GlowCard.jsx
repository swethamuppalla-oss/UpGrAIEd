import { useRef, useCallback } from 'react'

const CARD_KEYFRAMES = `
@keyframes glowCardIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
`

let injected = false

export default function GlowCard({ children, style, glowColor = '110,220,95', className }) {
  if (!injected) {
    injected = true
    const tag = document.createElement('style')
    tag.textContent = CARD_KEYFRAMES
    document.head.appendChild(tag)
  }

  const cardRef = useRef(null)
  const overlayRef = useRef(null)

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current
    const overlay = overlayRef.current
    if (!card || !overlay) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    overlay.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(${glowColor},0.10) 0%, transparent 65%)`
    overlay.style.opacity = '1'
  }, [glowColor])

  const onMouseLeave = useCallback((e) => {
    if (overlayRef.current) overlayRef.current.style.opacity = '0'
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = 'none'
  }, [])

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        overflow: 'hidden',
        transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `rgba(${glowColor},0.25)`
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `0 20px 60px rgba(${glowColor},0.08)`
      }}
    >
      {/* Mouse glow overlay */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          borderRadius: 'inherit',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
