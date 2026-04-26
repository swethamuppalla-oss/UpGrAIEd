import { useEffect, useRef } from 'react'

const SHAPES = ['🌿', '✦', '🍃', '⬡', '❋', '◈', '✿', '⬟']
const COLORS = ['#6EDC5F', '#A8F5A2', '#63C7FF', '#FFD95A', '#FF8A65']

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

export default function BloomParticles({ count = 22, zIndex = 0 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    shape: SHAPES[i % SHAPES.length],
    color: COLORS[i % COLORS.length],
    x: randomBetween(0, 100),
    y: randomBetween(10, 90),
    size: randomBetween(10, 22),
    duration: randomBetween(8, 20),
    delay: randomBetween(0, 10),
    dx: randomBetween(-30, 30),
    opacity: randomBetween(0.25, 0.65),
  }))

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex,
      }}
    >
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
            color: p.color,
            opacity: p.opacity,
            animation: `bloom-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            '--dx': `${p.dx}px`,
          }}
        >
          {p.shape}
        </div>
      ))}

      {/* Ambient background orbs */}
      <div style={{
        position: 'absolute', top: '-15%', left: '-8%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(110,220,95,0.12), transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'bloom-float 16s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(99,199,255,0.10), transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'bloom-float 20s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '55%',
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(255,217,90,0.07), transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'bloom-float 25s ease-in-out infinite 8s',
      }} />
    </div>
  )
}
