import { useNavigate } from 'react-router-dom'
import GlowCard from '../components/GlowCard'
import { useReveal } from '../hooks/useCmsPage'

export default function EcosystemSection({ data = {} }) {
  const [ref, visible] = useReveal(0.1)
  const navigate = useNavigate()

  const title = data.title || 'The Ecosystem'
  const subtitle = data.subtitle || 'Two products. One vision. Infinite learning.'
  const products = data.metadata?.products || []

  const animStyle = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
  })

  return (
    <section
      id="ecosystem"
      ref={ref}
      style={{ padding: '120px 32px', maxWidth: 1200, margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 72 }}>
        <span style={{
          ...animStyle(0),
          fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
          color: 'rgba(240,238,248,0.4)', textTransform: 'uppercase',
          display: 'block', marginBottom: 16,
        }}>
          PRODUCTS
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

      {/* Product cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 24,
      }}>
        {products.map((product, i) => (
          <GlowCard
            key={i}
            glowColor={product.accent === '#7B3FE4' ? '123,63,228' : '110,220,95'}
            style={{ padding: '48px 40px', ...animStyle(0.2 + i * 0.12) }}
          >
            {/* Status badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: `${product.statusColor || '#6EDC5F'}14`,
              border: `1px solid ${product.statusColor || '#6EDC5F'}30`,
              borderRadius: 100, padding: '4px 12px',
              marginBottom: 32,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: product.statusColor || '#6EDC5F',
                boxShadow: `0 0 6px ${product.statusColor || '#6EDC5F'}`,
                display: 'inline-block',
              }} />
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: product.statusColor || '#6EDC5F',
                letterSpacing: '0.06em',
              }}>
                {product.status}
              </span>
            </div>

            {/* Product name */}
            <h3 style={{
              fontSize: 40, fontWeight: 800,
              letterSpacing: '-0.03em',
              background: `linear-gradient(135deg, #F0EEF8, ${product.accent || '#6EDC5F'}80)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              marginBottom: 8, lineHeight: 1.1,
            }}>
              {product.name}
            </h3>

            {/* Tagline */}
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: product.accent || '#6EDC5F',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              {product.tagline}
            </div>

            {/* Description */}
            <p style={{
              fontSize: 16, color: 'rgba(240,238,248,0.55)',
              lineHeight: 1.75, marginBottom: 36,
            }}>
              {product.description}
            </p>

            {/* CTA */}
            <button
              onClick={() => navigate(product.link || '/login')}
              style={{
                background: 'none',
                border: `1px solid ${product.accent || '#6EDC5F'}40`,
                color: product.accent || '#6EDC5F',
                fontSize: 14, fontWeight: 600,
                padding: '12px 24px', borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${product.accent || '#6EDC5F'}12`
                e.currentTarget.style.borderColor = `${product.accent || '#6EDC5F'}70`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.borderColor = `${product.accent || '#6EDC5F'}40`
              }}
            >
              Explore {product.name} →
            </button>
          </GlowCard>
        ))}
      </div>
    </section>
  )
}
