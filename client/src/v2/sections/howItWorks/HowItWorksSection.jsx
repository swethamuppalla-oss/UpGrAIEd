import EditableText from '../../components/Editable/EditableText';
import EditableList from '../../components/Editable/EditableList';

/**
 * Section model:
 * { badge, heading, subheading, steps: [{icon, title, desc}] }
 */
export default function HowItWorksSection({ content, onContentChange }) {
  const u = (patch) => onContentChange?.({ ...content, ...patch });

  if (!content) return null;

  const steps = content.steps || [];

  return (
    <section style={{
      padding: '100px 32px',
      background: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient blob */}
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(110,220,95,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          {content.badge && <div className="pg-badge pg-badge-warm">{content.badge}</div>}
          <h2 className="pg-h2">
            <EditableText value={content.heading} onChange={(v) => u({ heading: v })} />
          </h2>
          {content.subheading && (
            <p className="pg-sub" style={{ maxWidth: 480, margin: '0 auto' }}>
              <EditableText multiline value={content.subheading} onChange={(v) => u({ subheading: v })} />
            </p>
          )}
        </div>

        {/* Steps row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 0,
          flexWrap: 'wrap',
        }}>
          <EditableList
            items={steps}
            onChange={(s) => u({ steps: s })}
            emptyItem={{ icon: '✨', title: 'New Step', desc: 'Describe this step.' }}
            renderItem={(step, i, onItemChange) => (
              <div style={{
                flex: '1 1 200px', maxWidth: 260,
                position: 'relative',
                padding: '0 16px',
                textAlign: 'center',
              }}>
                {/* Connector line — rendered on all but last visible step */}
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: 35,
                    left: '58%',
                    right: '-18%',
                    height: 2,
                    background: 'linear-gradient(90deg, rgba(110,220,95,0.4) 0%, rgba(110,220,95,0.1) 100%)',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Icon circle with step number */}
                <div style={{
                  width: 72, height: 72,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(110,220,95,0.15) 0%, rgba(110,220,95,0.06) 100%)',
                  border: '2px solid rgba(110,220,95,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                  position: 'relative', zIndex: 1,
                  flexDirection: 'column',
                  gap: 2,
                }}>
                  <span style={{ fontSize: 24 }}>{step.icon || '✨'}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
                    color: '#6EDC5F', lineHeight: 1,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 style={{
                  fontSize: 17, fontWeight: 700,
                  color: '#0A1F12', marginBottom: 10, lineHeight: 1.3,
                }}>
                  <EditableText value={step.title} onChange={(v) => onItemChange?.({ title: v })} />
                </h3>
                <p style={{
                  fontSize: 14, lineHeight: 1.7,
                  color: '#4B6B57',
                }}>
                  <EditableText multiline value={step.desc} onChange={(v) => onItemChange?.({ desc: v })} />
                </p>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
