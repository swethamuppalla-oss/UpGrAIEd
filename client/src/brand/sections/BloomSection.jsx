import GlowCard from '../components/GlowCard'
import MagneticButton from '../components/MagneticButton'
import { useReveal } from '../hooks/useCmsPage'

const BLOOM_AVATAR_KF = `
@keyframes bloomFloat {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
}
@keyframes bloomRing {
  0%   { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
}
`
let bloomKfInjected = false

export default function BloomSection({ data = {} }) {
  if (!bloomKfInjected) {
    bloomKfInjected = true
    const tag = document.createElement('style')
    tag.textContent = BLOOM_AVATAR_KF
    document.head.appendChild(tag)
  }

  const [ref, visible] = useReveal()

  const title = data.title || 'Meet Bloom'
  const subtitle = data.subtitle || 'Your child\'s AI learning companion — built on empathy, powered by intelligence, designed for curiosity.'
  const cta = data.primaryCTA || 'See Bloom in Action'
  const ctaLink = data.primaryCTALink || '/login?role=student'
  const features = data.metadata?.features || []

  const animStyle = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
  })

  return (
    <section
      ref={ref}
      style={{
        padding: '120px 32px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: 80,
        alignItems: 'center',
      }}>

        {/* Left — Bloom avatar */}
        <div style={{ ...animStyle(0), display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 320, height: 320 }}>
            {/* Pulsing rings */}
            {[0, 1, 2].map(i => (
              <div key={i} aria-hidden="true" style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                border: '1px solid rgba(110,220,95,0.12)',
                animation: `bloomRing 3s ${i * 1}s ease-out infinite`,
              }} />
            ))}

            {/* Core avatar */}
            <div style={{
              position: 'absolute', inset: '40px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(110,220,95,0.25) 0%, rgba(110,220,95,0.06) 50%, transparent 75%)',
              border: '1px solid rgba(110,220,95,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'bloomFloat 4s ease-in-out infinite',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 64, lineHeight: 1 }}>🌿</div>
                <div style={{
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                  color: '#6EDC5F', marginTop: 8, textTransform: 'uppercase',
                }}>
                  Bloom
                </div>
              </div>
            </div>

            {/* Orbiting data points */}
            {[
              { angle: 30,  label: 'Adaptive', icon: '🧠' },
              { angle: 150, label: 'Empathetic', icon: '💫' },
              { angle: 270, label: 'Precise', icon: '🎯' },
            ].map(({ angle, label, icon }) => {
              const rad = (angle * Math.PI) / 180
              const r = 140
              const cx = 160 + r * Math.cos(rad) - 32
              const cy = 160 + r * Math.sin(rad) - 20
              return (
                <div key={label} style={{
                  position: 'absolute', left: cx, top: cy,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '6px 12px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  backdropFilter: 'blur(8px)',
                }}>
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(240,238,248,0.7)', whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right — copy */}
        <div>
          <div style={{ ...animStyle(0.1), marginBottom: 12 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              color: '#6EDC5F', textTransform: 'uppercase',
            }}>
              AI COMPANION
            </span>
          </div>

          <h2 style={{
            ...animStyle(0.18),
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#F0EEF8', lineHeight: 1.12,
            marginBottom: 20,
          }}>
            {title}
          </h2>

          <p style={{
            ...animStyle(0.26),
            fontSize: 18, color: 'rgba(240,238,248,0.55)',
            lineHeight: 1.75, marginBottom: 40,
          }}>
            {subtitle}
          </p>

          {/* Feature grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
            marginBottom: 40,
          }}>
            {features.map((f, i) => (
              <GlowCard key={i} style={{ padding: '18px 20px', ...animStyle(0.28 + i * 0.06) }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: '#F0EEF8', marginBottom: 6,
                }}>{f.title}</div>
                <div style={{
                  fontSize: 13, color: 'rgba(240,238,248,0.5)', lineHeight: 1.6,
                }}>{f.description}</div>
              </GlowCard>
            ))}
          </div>

          <div style={animStyle(0.52)}>
            <MagneticButton href={ctaLink} variant="primary">
              {cta} →
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
