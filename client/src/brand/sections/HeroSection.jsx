import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MagneticButton from '../components/MagneticButton'
import { ensureKeyframes } from '../hooks/useCmsPage'

const HERO_KF = `
@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes heroTagPop {
  0%   { opacity: 0; transform: scale(0.85); }
  60%  { transform: scale(1.04); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes heroPulse {
  0%,100% { opacity: 0.5; }
  50%      { opacity: 1; }
}
@keyframes scanH {
  0%   { transform: translateX(-100%); opacity: 0; }
  5%   { opacity: 1; }
  95%  { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}
`

export default function HeroSection({ data = {} }) {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef(null)
  const titleRef = useRef(null)

  ensureKeyframes()

  useEffect(() => {
    const tag = document.createElement('style')
    tag.textContent = HERO_KF
    document.head.appendChild(tag)
    setMounted(true)
  }, [])

  // Subtle mouse parallax on headline
  useEffect(() => {
    const container = containerRef.current
    const title = titleRef.current
    if (!container || !title) return

    const onMove = (e) => {
      const rect = container.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / rect.width
      const dy = (e.clientY - cy) / rect.height
      title.style.transform = `translate(${dx * -12}px, ${dy * -8}px)`
    }
    container.addEventListener('mousemove', onMove, { passive: true })
    return () => container.removeEventListener('mousemove', onMove)
  }, [])

  const title = data.title || 'Human Teaching.\nAI-Guided Growth.'
  const subtitle = data.subtitle || 'The first AI-native learning ecosystem where every child gets a personalized companion, every parent gets real insight, and every lesson compounds into mastery.'
  const primaryCTA = data.primaryCTA || 'Start Learning'
  const secondaryCTA = data.secondaryCTA || 'Explore Ecosystem'
  const primaryLink = data.primaryCTALink || '/login?role=student'
  const secondaryLink = data.secondaryCTALink || '#ecosystem'

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 32px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scan line */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '42%', left: 0, right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(110,220,95,0.25) 50%, transparent 100%)',
        animation: 'scanH 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Tag pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(110,220,95,0.08)',
          border: '1px solid rgba(110,220,95,0.2)',
          borderRadius: 100,
          padding: '6px 16px',
          marginBottom: 40,
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'heroTagPop 0.6s ease forwards' : 'none',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#6EDC5F',
            boxShadow: '0 0 8px #6EDC5F',
            animation: 'heroPulse 2s ease-in-out infinite',
            display: 'inline-block',
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#6EDC5F', letterSpacing: '0.06em' }}>
            AI-NATIVE LEARNING ECOSYSTEM
          </span>
        </div>

        {/* Headline */}
        <h1
          ref={titleRef}
          style={{
            fontSize: 'clamp(48px, 8vw, 92px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#F0EEF8',
            marginBottom: 28,
            whiteSpace: 'pre-line',
            opacity: mounted ? 1 : 0,
            animation: mounted ? 'heroFadeUp 0.7s 0.1s ease forwards' : 'none',
            transition: 'transform 0.15s ease-out',
            willChange: 'transform',
          }}
        >
          {title.split('\n')[0]}{'\n'}
          <span style={{
            background: 'linear-gradient(135deg, #6EDC5F 0%, #3DAA3A 60%, #6EDC5F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 100%',
          }}>
            {title.split('\n')[1] || ''}
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(16px, 2.2vw, 20px)',
          color: 'rgba(240,238,248,0.58)',
          lineHeight: 1.75,
          maxWidth: 620,
          margin: '0 auto 52px',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'heroFadeUp 0.7s 0.22s ease forwards' : 'none',
        }}>
          {subtitle}
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 14, justifyContent: 'center',
          flexWrap: 'wrap',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'heroFadeUp 0.7s 0.34s ease forwards' : 'none',
        }}>
          <MagneticButton
            href={primaryLink}
            variant="primary"
            style={{ fontSize: 16, padding: '16px 36px', borderRadius: 14 }}
          >
            {primaryCTA} →
          </MagneticButton>
          <MagneticButton
            href={secondaryLink}
            variant="ghost"
            style={{ fontSize: 16, padding: '16px 36px', borderRadius: 14 }}
          >
            {secondaryCTA}
          </MagneticButton>
        </div>

        {/* Social proof line */}
        <div style={{
          marginTop: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 24, flexWrap: 'wrap',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'heroFadeUp 0.7s 0.5s ease forwards' : 'none',
        }}>
          {['10,000+ Students', '95% Satisfaction', '3× Retention', 'Live Today'].map((stat, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#6EDC5F', display: 'inline-block' }} />
              <span style={{ fontSize: 13, color: 'rgba(240,238,248,0.4)', fontWeight: 500 }}>
                {stat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 180,
        background: 'linear-gradient(to bottom, transparent, #06040F)',
        pointerEvents: 'none',
      }} />
    </section>
  )
}
