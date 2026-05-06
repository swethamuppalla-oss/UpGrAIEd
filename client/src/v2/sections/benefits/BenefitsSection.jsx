import EditableText from '../../components/Editable/EditableText';
import EditableList from '../../components/Editable/EditableList';

/**
 * Section model:
 * {
 *   id: "benefits",
 *   type: "benefits",
 *   content: { badge, heading, headingHighlight, subheading, items: [{icon, title, desc}] }
 * }
 */
export default function BenefitsSection({ content, onContentChange }) {
  const u = (patch) => onContentChange?.({ ...content, ...patch });

  if (!content) return null;

  return (
    <section className="pg-section" style={{ background: '#FFFFFF' }}>
      <div className="pg-container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          {content.badge && <div className="pg-badge">{content.badge}</div>}

          <h2 className="pg-h2">
            <EditableText value={content.heading} onChange={(v) => u({ heading: v })} />
            {content.headingHighlight && (
              <> <span className="bloom-text-green">
                <EditableText value={content.headingHighlight} onChange={(v) => u({ headingHighlight: v })} />
              </span></>
            )}
          </h2>

          <p className="pg-sub" style={{ maxWidth: 520, margin: '0 auto' }}>
            <EditableText multiline value={content.subheading} onChange={(v) => u({ subheading: v })} />
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <EditableList
            items={content.items || []}
            onChange={(items) => u({ items })}
            emptyItem={{ icon: '✨', title: 'New benefit', desc: 'Add a description.' }}
            renderItem={(item, i, onItemChange) => (
              <div key={i} className="pg-card" style={{ padding: 28 }}>
                <div className="pg-icon" style={{ marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0A1F12', marginBottom: 8 }}>
                  <EditableText value={item.title} onChange={(v) => onItemChange?.({ title: v })} />
                </h3>
                <p style={{ color: '#4B6B57', fontSize: 14, lineHeight: 1.65 }}>
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
