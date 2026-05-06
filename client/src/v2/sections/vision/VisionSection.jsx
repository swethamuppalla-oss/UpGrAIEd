import { useState } from 'react';
import EditableText from '../../components/Editable/EditableText';
import EditableList from '../../components/Editable/EditableList';

/**
 * Section model:
 * {
 *   id: "vision",
 *   type: "vision",
 *   content: { badge, heading, items: [string] }
 * }
 */
export default function VisionSection({ content, onContentChange }) {
  const [index, setIndex] = useState(0);
  const u = (patch) => onContentChange?.({ ...content, ...patch });

  if (!content) return null;

  const items = content.items || [];
  const current = items[index] ?? '';

  return (
    <section className="pg-section" style={{ background: '#F0FFF4' }}>
      <div className="pg-container-sm" style={{ textAlign: 'center' }}>
        {content.badge && <div className="pg-badge" style={{ justifyContent: 'center', display: 'inline-flex' }}>{content.badge}</div>}

        {content.heading && (
          <h2 className="pg-h2" style={{ marginBottom: 48 }}>
            <EditableText value={content.heading} onChange={(v) => u({ heading: v })} />
          </h2>
        )}

        {/* Carousel display */}
        <div style={{
          fontSize: 'clamp(20px, 3vw, 36px)', fontWeight: 800,
          color: '#0A1F12', lineHeight: 1.3,
          letterSpacing: '-0.02em', marginBottom: 32,
          minHeight: '2.6em', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="bloom-text-green">{current}</span>
        </div>

        {/* Dot nav */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? 24 : 10, height: 10,
                borderRadius: 5, border: 'none',
                background: i === index ? '#6EDC5F' : 'rgba(110,220,95,0.25)',
                cursor: 'pointer', padding: 0,
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>

        {/* Edit mode: show all items as a list */}
        <EditableList
          items={items.map(text => ({ text }))}
          onChange={(arr) => u({ items: arr.map(x => x.text) })}
          emptyItem={{ text: 'New vision statement' }}
          renderItem={(item, i, onItemChange) => (
            onItemChange ? (
              <div key={i} style={{ marginBottom: 8 }}>
                <EditableText value={item.text} onChange={(v) => onItemChange({ text: v })} />
              </div>
            ) : null
          )}
        />
      </div>
    </section>
  );
}
