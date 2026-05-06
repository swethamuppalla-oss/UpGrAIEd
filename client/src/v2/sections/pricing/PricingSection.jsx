import { useNavigate } from 'react-router-dom';
import EditableText from '../../components/Editable/EditableText';
import EditableList from '../../components/Editable/EditableList';

/**
 * Section model:
 * {
 *   id: "pricing",
 *   type: "pricing",
 *   content: {
 *     badge, heading, subheading,
 *     plans: [{name, price, period, subtext, features: [string], featured, ctaText}]
 *   }
 * }
 */
export default function PricingSection({ content, onContentChange }) {
  const navigate = useNavigate();
  const u = (patch) => onContentChange?.({ ...content, ...patch });

  if (!content) return null;

  return (
    <section className="pg-section" style={{ background: '#FFFFFF' }}>
      <div className="pg-container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          {content.badge && <div className="pg-badge">{content.badge}</div>}
          <h2 className="pg-h2">
            <EditableText value={content.heading} onChange={(v) => u({ heading: v })} />
          </h2>
          {content.subheading && (
            <p className="pg-sub" style={{ maxWidth: 480, margin: '0 auto' }}>
              <EditableText multiline value={content.subheading} onChange={(v) => u({ subheading: v })} />
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'start' }}>
          <EditableList
            items={content.plans || []}
            onChange={(plans) => u({ plans })}
            emptyItem={{ name: 'New Plan', price: '₹0', period: '/month', features: ['Feature 1'], featured: false, ctaText: 'Get Started' }}
            renderItem={(plan, i, onItemChange) => (
              <div key={i} className={`pg-price-card${plan.featured ? ' featured' : ''}`}>
                {plan.featured && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    padding: '4px 16px', borderRadius: 50,
                    background: 'linear-gradient(135deg, #6EDC5F, #A8F5A2)',
                    color: '#0D2010', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0A1F12', marginBottom: 12 }}>
                    <EditableText value={plan.name} onChange={(v) => onItemChange?.({ name: v })} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span className="pg-price-amount">
                      <EditableText value={plan.price} onChange={(v) => onItemChange?.({ price: v })} />
                    </span>
                    <span className="pg-price-period">
                      <EditableText value={plan.period} onChange={(v) => onItemChange?.({ period: v })} />
                    </span>
                  </div>
                  {plan.subtext && (
                    <p style={{ color: '#4B6B57', fontSize: 13, marginTop: 4 }}>
                      <EditableText value={plan.subtext} onChange={(v) => onItemChange?.({ subtext: v })} />
                    </p>
                  )}
                </div>

                <div style={{ flex: 1, marginBottom: 28 }}>
                  {(plan.features || []).map((f, fi) => (
                    <div key={fi} className="pg-feature-row">
                      <span className="pg-feature-check">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                  {(plan.excludes || []).map((f, fi) => (
                    <div key={fi} className="pg-feature-row" style={{ opacity: 0.4 }}>
                      <span className="pg-feature-x">✗</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`bloom-btn bloom-btn-scale ${plan.featured ? 'bloom-btn-primary' : 'bloom-btn-ghost'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate('/login')}
                >
                  <EditableText value={plan.ctaText} onChange={(v) => onItemChange?.({ ctaText: v })} />
                </button>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
