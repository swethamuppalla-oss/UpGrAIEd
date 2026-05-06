import { useNavigate } from 'react-router-dom';
import EditableText from '../../components/Editable/EditableText';

/**
 * Section model:
 * { badge, heading, subheading, ctaText, ctaSecondaryText, note }
 */
export default function CTASection({ content, onContentChange }) {
  const navigate = useNavigate();
  const u = (patch) => onContentChange?.({ ...content, ...patch });

  if (!content) return null;

  return (
    <section style={{
      padding: '100px 32px',
      background: 'linear-gradient(135deg, #0A2B14 0%, #0D3A1C 50%, #0A2B14 100%)',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '-20%', left: '20%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(110,220,95,0.12) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', right: '15%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,199,255,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {content.badge && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 16px', borderRadius: 50, marginBottom: 28,
            background: 'rgba(110,220,95,0.15)',
            border: '1px solid rgba(110,220,95,0.3)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6EDC5F', flexShrink: 0 }} />
            <span style={{ color: '#6EDC5F', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em' }}>
              {content.badge}
            </span>
          </div>
        )}

        <h2 style={{
          fontSize: 'clamp(36px, 5vw, 58px)',
          fontWeight: 900, lineHeight: 1.08,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          marginBottom: 20,
        }}>
          <EditableText value={content.heading} onChange={(v) => u({ heading: v })} />
        </h2>

        {content.subheading && (
          <p style={{
            fontSize: 18, lineHeight: 1.7,
            color: 'rgba(255,255,255,0.65)',
            marginBottom: 44,
          }}>
            <EditableText multiline value={content.subheading} onChange={(v) => u({ subheading: v })} />
          </p>
        )}

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          {content.ctaText && (
            <button
              className="bloom-btn bloom-btn-scale"
              style={{
                padding: '16px 40px', fontSize: 16, fontWeight: 700,
                background: '#6EDC5F', color: '#0A2B14', borderRadius: 50,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(110,220,95,0.35)',
              }}
              onClick={() => navigate('/login?role=student')}
            >
              <EditableText value={content.ctaText} onChange={(v) => u({ ctaText: v })} />
            </button>
          )}
          {content.ctaSecondaryText && (
            <button
              className="bloom-btn bloom-btn-scale"
              style={{
                padding: '16px 40px', fontSize: 16, fontWeight: 600,
                background: 'transparent', color: '#FFFFFF', borderRadius: 50,
                border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer',
              }}
              onClick={() => navigate('/book-demo')}
            >
              <EditableText value={content.ctaSecondaryText} onChange={(v) => u({ ctaSecondaryText: v })} />
            </button>
          )}
        </div>

        {content.note && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            <EditableText value={content.note} onChange={(v) => u({ note: v })} />
          </p>
        )}
      </div>
    </section>
  );
}
