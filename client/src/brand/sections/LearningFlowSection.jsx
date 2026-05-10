import { useReveal } from '../hooks/useCmsPage'

export default function LearningFlowSection({ data = {} }) {
  const [ref, visible] = useReveal(0.1)

  const title = data.title || 'How UpGrAIEd Works'
  const subtitle = data.subtitle || 'A learning system that adapts, compounds, and grows with every child.'
  const steps = data.metadata?.steps || []

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
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <span style={{
            ...animStyle(0),
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            color: '#7B3FE4', textTransform: 'uppercase',
            display: 'block', marginBottom: 16,
          }}>
            THE PROCESS
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
            maxWidth: 520, margin: '0 auto',
          }}>
            {subtitle}
          </p>
        </div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 2,
          position: 'relative',
        }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                ...animStyle(0.2 + i * 0.1),
                position: 'relative',
                padding: '40px 32px',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                borderRadius: 0,
                borderLeft: i === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div aria-hidden="true" style={{
                  position: 'absolute',
                  right: -20, top: '50%',
                  width: 40, height: 1,
                  background: 'linear-gradient(90deg, rgba(110,220,95,0.3), rgba(123,63,228,0.3))',
                  zIndex: 2,
                  display: 'none', // visible on desktop only — handled by grid gap
                }} />
              )}

              <div style={{
                fontSize: 48, fontWeight: 800,
                background: 'linear-gradient(135deg, rgba(110,220,95,0.25), rgba(123,63,228,0.15))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                marginBottom: 16, letterSpacing: '-0.04em',
                lineHeight: 1,
              }}>
                {step.number}
              </div>

              <div style={{
                fontSize: 20, fontWeight: 700,
                color: '#F0EEF8', marginBottom: 12,
              }}>
                {step.title}
              </div>

              <div style={{
                fontSize: 14, color: 'rgba(240,238,248,0.5)',
                lineHeight: 1.75,
              }}>
                {step.description}
              </div>

              {/* Bottom accent */}
              <div style={{
                position: 'absolute', bottom: 0, left: 32, right: 32, height: 2,
                background: i === 0
                  ? 'linear-gradient(90deg, #6EDC5F, transparent)'
                  : i === steps.length - 1
                    ? 'linear-gradient(90deg, transparent, #7B3FE4)'
                    : 'linear-gradient(90deg, rgba(110,220,95,0.3), rgba(123,63,228,0.3))',
                borderRadius: 2,
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
