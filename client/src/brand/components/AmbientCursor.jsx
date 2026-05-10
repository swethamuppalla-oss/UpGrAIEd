import { useEffect, useRef } from 'react'

export default function AmbientCursor() {
  const cursorRef = useRef(null)
  const pos = useRef({ x: -1000, y: -1000 })
  const target = useRef({ x: -1000, y: -1000 })
  const rafId = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const lerp = (a, b, t) => a + (b - a) * t

    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.1)
      pos.current.y = lerp(pos.current.y, target.current.y, 0.1)

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${pos.current.x - 300}px, ${pos.current.y - 300}px)`
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(110,220,95,0.07) 0%, rgba(123,63,228,0.04) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
        filter: 'blur(0px)',
        transition: 'opacity 0.3s ease',
      }}
    />
  )
}
