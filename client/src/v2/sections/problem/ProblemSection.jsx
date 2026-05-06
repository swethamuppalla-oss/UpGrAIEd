import EditableText from '../../components/Editable/EditableText';
import EditableList from '../../components/Editable/EditableList';

/**
 * Section model:
 * { badge, heading, subheading,
 *   oldWay:  { label, items: [string] },
 *   newWay:  { label, items: [string] } }
 */
export default function ProblemSection({ content, onContentChange }) {
  const u = (patch) => onContentChange?.({ ...content, ...patch });

  if (!content) return null;

  return (
    <section style={{
      padding: '100px 32px',
      background: '#FAFFFE',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '20%', right: '-4%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,199,255,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
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

        {/* Two-column comparison */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
        }} className="hero-grid">

          {/* OLD WAY */}
          <ComparisonColumn
            column={content.oldWay}
            onChange={(v) => u({ oldWay: v })}
            variant="old"
          />

          {/* NEW WAY */}
          <ComparisonColumn
            column={content.newWay}
            onChange={(v) => u({ newWay: v })}
            variant="new"
          />
        </div>
      </div>
    </section>
  );
}

function ComparisonColumn({ column, onChange, variant }) {
  const isNew = variant === 'new';
  const u = (patch) => onChange?.({ ...column, ...patch });

  return (
    <div style={{
      borderRadius: 24,
      padding: '36px 32px',
      background: isNew ? 'rgba(110,220,95,0.06)' : 'rgba(10,31,18,0.03)',
      border: `1px solid ${isNew ? 'rgba(110,220,95,0.22)' : 'rgba(10,31,18,0.08)'}`,
      boxShadow: isNew
        ? '0 8px 32px rgba(110,220,95,0.08)'
        : '0 4px 16px rgba(10,31,18,0.04)',
    }}>
      {/* Column label */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 14px', borderRadius: 50,
        marginBottom: 28,
        background: isNew ? 'rgba(110,220,95,0.15)' : 'rgba(10,31,18,0.06)',
        border: `1px solid ${isNew ? 'rgba(110,220,95,0.3)' : 'rgba(10,31,18,0.12)'}`,
      }}>
        <span style={{ fontSize: 14 }}>{isNew ? '✅' : '❌'}</span>
        <span style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.07em',
          color: isNew ? '#2A7A20' : '#6B7280',
        }}>
          <EditableText value={column?.label} onChange={(v) => u({ label: v })} />
        </span>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <EditableList
          items={(column?.items || []).map(text => ({ text }))}
          onChange={(arr) => u({ items: arr.map(x => x.text) })}
          emptyItem={{ text: 'Add item' }}
          renderItem={(item, i, onItemChange) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                background: isNew ? 'rgba(110,220,95,0.2)' : 'rgba(239,68,68,0.08)',
                color: isNew ? '#2A7A20' : '#EF4444',
              }}>
                {isNew ? '✓' : '✗'}
              </span>
              <span style={{
                fontSize: 15, lineHeight: 1.6,
                color: isNew ? '#0A1F12' : '#6B7280',
                textDecoration: isNew ? 'none' : 'none',
              }}>
                <EditableText value={item.text} onChange={(v) => onItemChange?.({ text: v })} />
              </span>
            </div>
          )}
        />
      </div>
    </div>
  );
}
