import { useReveal } from '../hooks/useCmsPage'
import GlowCard from '../components/GlowCard'

const COUNTER_KF = `
@keyframes countUp {
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
`
let ptKfInjected = false

export default function ParentTrustSection({ data = {} }) {
  if (!ptKfInjected) {
    ptKfInjected = true
    const tag = document.createElement('style')
    tag.textContent = COUNTER_KF
    document.head.appendChild(tag)
  }

  const [ref, visible] = useReveal(0.1)

  const title = data.title || 'Trusted by 10,000+ Families'
  const subtitle = data.subtitle || 'Real results. Real families. Real transformation.'
  const stats = data.metadata?.stats || []
  const testimonials = data.metadata?.testimonials || []

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
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{
            ...animStyle(0),
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            color: 'rgba(240,238,248,0.4)', textTransform: 'uppercase',
            display: 'block', marginBottom: 16,
          }}>
            SOCIAL PROOF
          </span>
          <h2 style={{
            ...animStyle(0.08),
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#F0EEF8', marginBottom: 16,
          }}>
            {title}
          </h2>
          <p style={{
            ...animStyle(0.16),
            fontSize: 18, color: 'rgba(240,238,248,0.5)',
          }}>
            {subtitle}
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 2,
          marginBottom: 64,
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20,
          overflow: 'hidden',
        }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                ...animStyle(0.2 + i * 0.08),
                textAlign: 'center',
                padding: '40px 24px',
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
              }}
            >
              <div style={{
                fontSize: 'clamp(36px, 4vw, 48px)',
                fontWeight: 800, letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #F0EEF8, rgba(110,220,95,0.8))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                animation: visible ? `countUp 0.5s ${0.3 + i * 0.1}s ease both` : 'none',
                display: 'block',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 13, fontWeight: 500,
                color: 'rgba(240,238,248,0.45)', marginTop: 8,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {testimonials.map((t, i) => (
            <GlowCard
              key={i}
              style={{ padding: '32px 28px', ...animStyle(0.3 + i * 0.1) }}
            >
              {/* Stars */}
              <div style={{ marginBottom: 16 }}>
                {'★★★★★'.split('').map((s, j) => (
                  <span key={j} style={{ color: '#6EDC5F', fontSize: 14 }}>{s}</span>
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: 15, color: 'rgba(240,238,248,0.7)',
                lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic',
              }}>
                "{t.quote}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3DAA3A, #6EDC5F)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: '#06040F',
                }}>
                  {t.name?.[0] || '?'}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F0EEF8' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(240,238,248,0.4)' }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
}
