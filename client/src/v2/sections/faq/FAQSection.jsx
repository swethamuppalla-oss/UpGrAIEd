import { useState } from 'react';
import EditableText from '../../components/Editable/EditableText';
import EditableList from '../../components/Editable/EditableList';

/**
 * Section model:
 * {
 *   id: "faq",
 *   type: "faq",
 *   content: { badge, heading, items: [{question, answer}] }
 * }
 */
export default function FAQSection({ content, onContentChange }) {
  const [openIndex, setOpenIndex] = useState(null);
  const u = (patch) => onContentChange?.({ ...content, ...patch });

  if (!content) return null;

  return (
    <section className="pg-section" style={{ background: '#F7FFF8' }}>
      <div className="pg-container-sm">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          {content.badge && <div className="pg-badge pg-badge-warm">{content.badge}</div>}
          <h2 className="pg-h2">
            <EditableText value={content.heading} onChange={(v) => u({ heading: v })} />
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <EditableList
            items={content.items || []}
            onChange={(items) => u({ items })}
            emptyItem={{ question: 'New question?', answer: 'Add the answer here.' }}
            renderItem={(faq, i, onItemChange) => (
              <div key={i} className={`pg-faq-item${openIndex === i ? ' open' : ''}`}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    width: '100%', padding: '20px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', gap: 16,
                  }}
                >
                  <span style={{ color: '#0A1F12', fontSize: 15, fontWeight: 600, lineHeight: 1.5, flex: 1 }}>
                    <EditableText
                      value={faq.question}
                      onChange={(v) => onItemChange?.({ question: v })}
                    />
                  </span>
                  <span style={{
                    color: '#6EDC5F', fontSize: 22, flexShrink: 0,
                    transition: 'transform 0.25s',
                    transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)',
                    display: 'inline-block',
                  }}>+</span>
                </button>

                {openIndex === i && (
                  <div className="pg-faq-answer">
                    <EditableText multiline value={faq.answer} onChange={(v) => onItemChange?.({ answer: v })} />
                  </div>
                )}
              </div>
            )}
          />

          <div style={{
            marginTop: 20, padding: '20px 24px', borderRadius: 16,
            background: 'rgba(110,220,95,0.08)', border: '1px solid rgba(110,220,95,0.2)',
            textAlign: 'center',
          }}>
            <p style={{ color: '#4B6B57', fontSize: 15, margin: 0 }}>
              Still have questions?{' '}
              <a href="mailto:hello@upgraied.com" style={{ color: '#6EDC5F', fontWeight: 700 }}>
                Email us →
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
