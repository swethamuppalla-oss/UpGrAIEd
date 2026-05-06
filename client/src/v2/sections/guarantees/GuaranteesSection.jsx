import EditableText from '../../components/Editable/EditableText';
import EditableList from '../../components/Editable/EditableList';

/**
 * Section model:
 * { badge, heading, subheading, items: [{icon, title, desc}] }
 */
export default function GuaranteesSection({ content, onContentChange }) {
  const u = (patch) => onContentChange?.({ ...content, ...patch });

  if (!content) return null;

  return (
    <section style={{
      padding: '80px 32px',
      background: '#FFFFFF',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          {content.badge && <div className="pg-badge pg-badge-sky">{content.badge}</div>}
          <h2 className="pg-h2">
            <EditableText value={content.heading} onChange={(v) => u({ heading: v })} />
          </h2>
          {content.subheading && (
            <p className="pg-sub" style={{ maxWidth: 460, margin: '0 auto' }}>
              <EditableText multiline value={content.subheading} onChange={(v) => u({ subheading: v })} />
            </p>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}>
          <EditableList
            items={content.items || []}
            onChange={(items) => u({ items })}
            emptyItem={{ icon: '🛡️', title: 'New guarantee', desc: 'Describe it.' }}
            renderItem={(item, i, onItemChange) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: '36px 24px',
                borderRadius: 20,
                background: 'rgba(247,255,248,0.7)',
                border: '1px solid rgba(110,220,95,0.12)',
                boxShadow: '0 4px 24px rgba(10,31,18,0.04)',
              }}>
                <div style={{
                  fontSize: 36, marginBottom: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.icon}
                </div>
                <h4 style={{
                  fontSize: 16, fontWeight: 700,
                  color: '#0A1F12', marginBottom: 10,
                }}>
                  <EditableText value={item.title} onChange={(v) => onItemChange?.({ title: v })} />
                </h4>
                <p style={{ fontSize: 13, color: '#4B6B57', lineHeight: 1.65 }}>
                  <EditableText multiline value={item.desc} onChange={(v) => onItemChange?.({ desc: v })} />
                </p>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
