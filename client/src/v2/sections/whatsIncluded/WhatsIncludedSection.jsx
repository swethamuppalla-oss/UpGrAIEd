import EditableText from '../../components/Editable/EditableText';
import EditableList from '../../components/Editable/EditableList';

/**
 * Section model:
 * { badge, heading, subheading, items: [{icon, title, desc}] }
 */
export default function WhatsIncludedSection({ content, onContentChange }) {
  const u = (patch) => onContentChange?.({ ...content, ...patch });

  if (!content) return null;

  return (
    <section style={{
      padding: '100px 32px',
      background: '#F7FFF8',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(110,220,95,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          {content.badge && <div className="pg-badge pg-badge-warm">{content.badge}</div>}
          <h2 className="pg-h2">
            <EditableText value={content.heading} onChange={(v) => u({ heading: v })} />
          </h2>
          {content.subheading && (
            <p className="pg-sub" style={{ maxWidth: 500, margin: '0 auto' }}>
              <EditableText multiline value={content.subheading} onChange={(v) => u({ subheading: v })} />
            </p>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          <EditableList
            items={content.items || []}
            onChange={(items) => u({ items })}
            emptyItem={{ icon: '✅', title: 'New feature', desc: 'Describe what\'s included.' }}
            renderItem={(item, i, onItemChange) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 16,
                padding: '20px 24px',
                borderRadius: 16,
                background: '#FFFFFF',
                border: '1px solid rgba(110,220,95,0.15)',
                boxShadow: '0 2px 12px rgba(10,31,18,0.04)',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(110,220,95,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0A1F12', marginBottom: 4 }}>
                    <EditableText value={item.title} onChange={(v) => onItemChange?.({ title: v })} />
                  </h4>
                  <p style={{ fontSize: 13, color: '#4B6B57', lineHeight: 1.6 }}>
                    <EditableText multiline value={item.desc} onChange={(v) => onItemChange?.({ desc: v })} />
                  </p>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
