import MagneticButton from '../components/MagneticButton'
import { useReveal } from '../hooks/useCmsPage'

const CTA_KF = `
@keyframes ctaGlowPulse {
  0%,100% { opacity: 0.3; transform: scale(1); }
  50%      { opacity: 0.6; transform: scale(1.05); }
}
`
let ctaKfInjected = false

export default function CTASection({ data = {} }) {
  if (!ctaKfInjected) {
    ctaKfInjected = true
    const tag = document.createElement('style')
    tag.textContent = CTA_KF
    document.head.appendChild(tag)
  }

  const [ref, visible] = useReveal(0.15)

  const title = data.title || 'Ready to Transform Learning?'
  const subtitle = data.subtitle || 'Join thousands of families who chose intelligence over information overload.'
  const primaryCTA = data.primaryCTA || 'Start Free Trial'
  const secondaryCTA = data.secondaryCTA || 'Book a Demo'
  const primaryLink = data.primaryCTALink || '/login?role=student'
  const secondaryLink = data.secondaryCTALink || '/book-demo'

  const animStyle = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
  })

  return (
    <section
      ref={ref}
      style={{
        padding: '160px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(110,220,95,0.07) 0%, transparent 70%)',
        animation: 'ctaGlowPulse 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
        <span style={{
          ...animStyle(0),
          fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
          color: '#6EDC5F', textTransform: 'uppercase',
          display: 'block', marginBottom: 24,
        }}>
          GET STARTED TODAY
        </span>

        <h2 style={{
          ...animStyle(0.1),
          fontSize: 'clamp(36px, 6vw, 68px)',
          fontWeight: 800, letterSpacing: '-0.03em',
          color: '#F0EEF8', lineHeight: 1.1,
          marginBottom: 24,
        }}>
          {title}
        </h2>

        <p style={{
          ...animStyle(0.18),
          fontSize: 18,
          color: 'rgba(240,238,248,0.5)',
          lineHeight: 1.75,
          maxWidth: 500, margin: '0 auto 52px',
        }}>
          {subtitle}
        </p>

        <div style={{
          ...animStyle(0.26),
          display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          <MagneticButton
            href={primaryLink}
            variant="primary"
            style={{ fontSize: 17, padding: '18px 40px', borderRadius: 14 }}
          >
            {primaryCTA} →
          </MagneticButton>
          <MagneticButton
            href={secondaryLink}
            variant="ghost"
            style={{ fontSize: 17, padding: '18px 40px', borderRadius: 14 }}
          >
            {secondaryCTA}
          </MagneticButton>
        </div>

        {/* Fine print */}
        <p style={{
          ...animStyle(0.38),
          fontSize: 13, color: 'rgba(240,238,248,0.25)',
          marginTop: 28,
        }}>
          No credit card required · Free for 14 days · Cancel anytime
        </p>
      </div>
    </section>
  )
}
