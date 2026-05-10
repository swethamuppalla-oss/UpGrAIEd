import { useRef, useCallback } from 'react'

export default function MagneticButton({
  children,
  onClick,
  href,
  style,
  strength = 0.35,
  variant = 'primary',
  disabled = false,
}) {
  const btnRef = useRef(null)

  const getStyle = () => {
    if (variant === 'primary') return {
      background: 'linear-gradient(135deg, #3DAA3A, #6EDC5F)',
      color: '#06040F',
      border: 'none',
      fontWeight: 700,
    }
    if (variant === 'ghost') return {
      background: 'rgba(255,255,255,0.04)',
      color: 'rgba(240,238,248,0.85)',
      border: '1px solid rgba(255,255,255,0.12)',
      fontWeight: 600,
    }
    return {}
  }

  const onMouseMove = useCallback((e) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = (e.clientX - centerX) * strength
    const dy = (e.clientY - centerY) * strength
    btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.02)`
  }, [strength])

  const onMouseLeave = useCallback(() => {
    if (btnRef.current) {
      btnRef.current.style.transform = 'translate(0,0) scale(1)'
      btnRef.current.style.boxShadow = 'none'
    }
  }, [])

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 28px',
    borderRadius: 12,
    fontSize: 15,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 0.25s cubic-bezier(0.23,1,0.32,1), box-shadow 0.25s ease, opacity 0.2s',
    userSelect: 'none',
    textDecoration: 'none',
    opacity: disabled ? 0.5 : 1,
    letterSpacing: '-0.01em',
    ...getStyle(),
    ...style,
  }

  const handleClick = disabled ? undefined : onClick

  if (href && !disabled) {
    return (
      <a
        ref={btnRef}
        href={href}
        style={base}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow =
            variant === 'primary'
              ? '0 12px 40px rgba(110,220,95,0.35)'
              : '0 12px 40px rgba(255,255,255,0.06)'
        }}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      disabled={disabled}
      style={base}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow =
          variant === 'primary'
            ? '0 12px 40px rgba(110,220,95,0.35)'
            : '0 12px 40px rgba(255,255,255,0.06)'
      }}
    >
      {children}
    </button>
  )
}
