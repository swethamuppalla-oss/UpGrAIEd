import EditableText from '../../components/Editable/EditableText';
import EditableList from '../../components/Editable/EditableList';

/**
 * Section model:
 * {
 *   id: "trust",
 *   type: "trust",
 *   content: {
 *     badge, heading, headingHighlight, subheading,
 *     stats: [{value, label, icon}],
 *     points: [{icon, title, desc}]
 *   }
 * }
 */
export default function TrustSection({ content, onContentChange }) {
  const u = (patch) => onContentChange?.({ ...content, ...patch });

  if (!content) return null;

  return (
    <section className="pg-section pg-section-alt">
      <div className="pg-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          {content.badge && <div className="pg-badge pg-badge-sky">{content.badge}</div>}
          <h2 className="pg-h2">
            <EditableText value={content.heading} onChange={(v) => u({ heading: v })} />
            {content.headingHighlight && (
              <> <span className="bloom-text-sky">
                <EditableText value={content.headingHighlight} onChange={(v) => u({ headingHighlight: v })} />
              </span></>
            )}
          </h2>
          <p className="pg-sub" style={{ maxWidth: 480, margin: '0 auto' }}>
            <EditableText multiline value={content.subheading} onChange={(v) => u({ subheading: v })} />
          </p>
        </div>

        {/* Stats row */}
        {content.stats?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 48 }}>
            <EditableList
              items={content.stats}
              onChange={(stats) => u({ stats })}
              emptyItem={{ value: '0', label: 'New stat', icon: '📊' }}
              renderItem={(stat, i, onItemChange) => (
                <div key={i} className="pg-stat-card">
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                  <div className="pg-stat-value">
                    <EditableText value={stat.value} onChange={(v) => onItemChange?.({ value: v })} />
                  </div>
                  <div className="pg-stat-label">
                    <EditableText value={stat.label} onChange={(v) => onItemChange?.({ label: v })} />
                  </div>
                </div>
              )}
            />
          </div>
        )}

        <div className="bloom-divider" style={{ marginBottom: 48 }} />

        {/* Trust points grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          <EditableList
            items={content.points || []}
            onChange={(points) => u({ points })}
            emptyItem={{ icon: '✅', title: 'New point', desc: 'Add description.' }}
            renderItem={(point, i, onItemChange) => (
              <div key={i} className="pg-card" style={{ display: 'flex', gap: 16, padding: 24 }}>
                <div className="pg-icon" style={{ width: 44, height: 44, fontSize: 22, flexShrink: 0 }}>
                  {point.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0A1F12', marginBottom: 6 }}>
                    <EditableText value={point.title} onChange={(v) => onItemChange?.({ title: v })} />
                  </h4>
                  <p style={{ color: '#4B6B57', fontSize: 13, lineHeight: 1.65 }}>
                    <EditableText multiline value={point.desc} onChange={(v) => onItemChange?.({ desc: v })} />
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
