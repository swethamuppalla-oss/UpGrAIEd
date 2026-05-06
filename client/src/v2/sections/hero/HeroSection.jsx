import { useNavigate } from 'react-router-dom';
import EditableText from '../../components/Editable/EditableText';
import EditableImage from '../../components/Editable/EditableImage';

const AVATAR_STACK = [
  { bg: '#D4F5CE', emoji: '👩' },
  { bg: '#C8EDFF', emoji: '👨' },
  { bg: '#FFF3B0', emoji: '👩' },
  { bg: '#FFD9C9', emoji: '👧' },
  { bg: '#D4F5CE', emoji: '👦' },
];

export default function HeroSection({ content, onContentChange }) {
  const navigate = useNavigate();
  const u = (patch) => onContentChange?.({ ...content, ...patch });

  if (!content) return null;

  const hasImage = content.image !== undefined;

  return (
    <section style={{
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
      padding: 'clamp(100px, 12vw, 160px) 32px 80px',
      background: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', top: '-15%', left: '-8%',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(110,220,95,0.11) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,199,255,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto', width: '100%',
        display: 'grid',
        gridTemplateColumns: hasImage ? '1fr 1fr' : '1fr',
        gap: 80,
        alignItems: 'center',
      }} className="hero-grid">

        {/* ── LEFT: Copy ────────────────────────────────── */}
        <div style={{ animation: 'bloom-rise 0.7s ease both' }}>

          {/* Badge */}
          {content.badge && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              padding: '6px 18px 6px 12px',
              borderRadius: 50,
              background: 'rgba(110,220,95,0.1)',
              border: '1px solid rgba(110,220,95,0.28)',
              marginBottom: 32,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: '#6EDC5F',
                boxShadow: '0 0 8px rgba(110,220,95,0.7)',
                animation: 'bloom-pulse-glow 2s ease-in-out infinite',
              }} />
              <span style={{ color: '#2A7A20', fontSize: 12, fontWeight: 700, letterSpacing: '0.09em' }}>
                <EditableText value={content.badge} onChange={(v) => u({ badge: v })} />
              </span>
            </div>
          )}

          {/* H1 */}
          <h1 style={{
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            fontWeight: 900, lineHeight: 1.06,
            letterSpacing: '-0.03em',
            color: '#0A1F12',
            marginBottom: 0,
          }}>
            <EditableText value={content.title} onChange={(v) => u({ title: v })} />
          </h1>

          {content.titleHighlight && (
            <h1 style={{
              fontSize: 'clamp(40px, 5.5vw, 72px)',
              fontWeight: 900, lineHeight: 1.06,
              letterSpacing: '-0.03em',
              marginBottom: 28,
            }}>
              <span className="bloom-text-green">
                <EditableText value={content.titleHighlight} onChange={(v) => u({ titleHighlight: v })} />
              </span>
            </h1>
          )}

          {/* Subtitle */}
          <p style={{
            fontSize: 19, lineHeight: 1.78,
            color: '#4B6B57',
            marginBottom: 44,
            maxWidth: hasImage ? '100%' : 560,
          }}>
            <EditableText multiline value={content.subtitle} onChange={(v) => u({ subtitle: v })} />
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }} className="hero-actions">
            {content.ctaText && (
              <button
                className="bloom-btn bloom-btn-primary bloom-btn-scale"
                style={{ fontSize: 16, padding: '16px 36px' }}
                onClick={() => navigate('/login?role=student')}
              >
                <EditableText value={content.ctaText} onChange={(v) => u({ ctaText: v })} />
              </button>
            )}
            {content.ctaSecondaryText && (
              <button
                className="bloom-btn bloom-btn-ghost bloom-btn-scale"
                style={{ fontSize: 16, padding: '16px 36px' }}
                onClick={() => navigate('/book-demo')}
              >
                <EditableText value={content.ctaSecondaryText} onChange={(v) => u({ ctaSecondaryText: v })} />
              </button>
            )}
          </div>

          {/* Social proof */}
          {content.socialProof && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex' }}>
                {AVATAR_STACK.map((av, i) => (
                  <div key={i} style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: av.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                    marginLeft: i > 0 ? -10 : 0,
                    border: '2px solid #FFFFFF',
                  }}>{av.emoji}</div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{ color: '#FFD95A', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <p style={{ color: '#4B6B57', fontSize: 13, fontWeight: 500 }}>
                  <EditableText value={content.socialProof} onChange={(v) => u({ socialProof: v })} />
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Visual ────────────────────────────── */}
        {hasImage && (
          <div style={{ animation: 'bloom-rise 0.7s ease 0.15s both' }}>
            <EditableImage
              src={content.image}
              alt="UpgrAIed product"
              onChange={(v) => u({ image: v })}
              style={{
                width: '100%', borderRadius: 28,
                boxShadow: '0 24px 80px rgba(10,31,18,0.10), 0 0 0 1px rgba(110,220,95,0.12)',
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
