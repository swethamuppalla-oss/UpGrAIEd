import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';
import { useEditMode } from '../../context/EditModeContext';
import EditableText from '../admin/EditableText';
import { trackEvent, EVENTS } from '../../utils/analytics';
import { getContent, updateContent } from '../../services'
import BloomGrid from '../common/BloomGrid';

// ── Carousel component ─────────────────────────────────────────────────────────
function Carousel({ images = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex(i => (i + 1) % images.length), 3000);
    return () => clearInterval(id);
  }, [images]);

  if (!images.length) return null;

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 28, overflow: 'hidden' }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          style={{
            width: '100%', display: 'block', borderRadius: 28,
            position: i === 0 ? 'relative' : 'absolute',
            top: 0, left: 0,
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.6s ease',
            boxShadow: '0 24px 80px rgba(10,31,18,0.10)',
          }}
        />
      ))}
      <div style={{
        position: 'absolute', bottom: 14, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 6,
      }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 20 : 8,
              height: 8, borderRadius: 4,
              background: i === index ? '#6EDC5F' : 'rgba(255,255,255,0.5)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Hero type toggle (admin only) ─────────────────────────────────────────────
const MEDIA_TYPES = ['video', 'grid', 'carousel'];

function HeroTypeToggle({ type, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', borderRadius: 8, overflow: 'hidden',
      border: '1px solid rgba(110,220,95,0.35)',
      background: 'rgba(255,255,255,0.9)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    }}>
      {MEDIA_TYPES.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            padding: '6px 14px', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.05em', border: 'none', cursor: 'pointer',
            background: type === t ? 'rgba(110,220,95,0.18)' : 'transparent',
            color: type === t ? '#2A7A20' : 'rgba(13,35,24,0.45)',
            textTransform: 'uppercase',
            transition: 'all 0.15s',
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const navigate = useNavigate();
  const config = useConfig();
  const { editMode, activeHeroConfig, updateDraft, isAdmin } = useEditMode();

  const [section, setSection] = useState(null); // content_sections doc

  useEffect(() => {
    getContent('hero').then(data => { if (data) setSection(data); });
  }, []);

  const hero = config.hero || {};

  // Resolve displayed text: editMode draft > content_section > config fallback
  const headline    = editMode ? (activeHeroConfig?.title   ?? section?.headline  ?? hero.title)   : (section?.headline  ?? hero.title   ?? 'Learn Your Subjects. Master How to Think with AI');
  const subtext     = editMode ? (activeHeroConfig?.subtitle ?? section?.subtext   ?? hero.subtitle) : (section?.subtext   ?? hero.subtitle ?? 'Upload your school pages. We turn them into a structured 7-day learning journey.');
  const ctaPrimary  = section?.ctaPrimary  || 'Start Learning Free';
  const ctaSecondary = section?.ctaSecondary || 'See How It Works';
  // 'slideshow' is a legacy alias for 'carousel'
  const rawType     = section?.type || 'video';
  const mediaType   = rawType === 'slideshow' ? 'carousel' : rawType;
  const videoUrl    = section?.media?.videoUrl || '/videos/hero.mp4';
  const slides      = section?.media?.slides   || [];
  const gridImages  = section?.media?.gridImages || slides;

  const handleTypeChange = async (newType) => {
    const updated = { ...section, type: newType };
    setSection(updated);
    try { await updateContent('hero', updated); } catch {}
  };

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: editMode ? '164px 32px 80px' : '120px 32px 80px',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(160deg, #FFFFFF 0%, #F7FFF8 40%, #F0FFF4 100%)',
      transition: 'padding 0.2s ease',
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', top: '5%', left: '-10%',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(110,220,95,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '0%', right: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,199,255,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto', width: '100%',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 64, alignItems: 'center',
      }} className="hero-grid">

        {/* ── LEFT: Copy ── */}
        <div style={{ animation: 'bloom-rise 0.8s ease both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px 5px 10px', borderRadius: 50,
            background: 'rgba(110,220,95,0.10)',
            border: '1px solid rgba(110,220,95,0.25)',
            marginBottom: 28,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#6EDC5F', display: 'inline-block',
              boxShadow: '0 0 8px #6EDC5F',
              animation: 'bloom-pulse-glow 2s ease-in-out infinite',
            }} />
            <span style={{ color: '#2A7A20', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>
              AI LEARNING FOR AGES 8–14
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(38px, 5.5vw, 72px)',
            fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em',
            color: '#0A1F12', marginBottom: 24,
          }}>
            {editMode ? (
              <EditableText
                value={activeHeroConfig?.title ?? headline}
                onChange={(val) => updateDraft('hero', { title: val })}
                multiline
              />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: headline }} />
            )}
          </h1>

          <p style={{
            fontSize: 18, lineHeight: 1.75,
            color: '#4B6B57', marginBottom: 40, maxWidth: 460,
          }}>
            {editMode ? (
              <EditableText
                value={activeHeroConfig?.subtitle ?? subtext}
                onChange={(val) => updateDraft('hero', { subtitle: val })}
                multiline
              />
            ) : subtext}
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }} className="hero-actions">
            <button
              onClick={() => { trackEvent(EVENTS.CTA_CLICK, { location: 'hero' }); navigate('/login?role=student'); }}
              className="bloom-btn-primary btn-primary bloom-btn-scale"
              style={{ fontSize: 16, padding: '15px 32px' }}
            >
              {ctaPrimary}
            </button>
            <button
              onClick={() => navigate('/why-v2')}
              className="bloom-btn-ghost btn-secondary bloom-btn-scale"
              style={{ fontSize: 16, padding: '15px 32px' }}
            >
              {ctaSecondary}
            </button>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex' }}>
              {['#4DB84A','#63C7FF','#6EDC5F','#FFD95A','#FF8A65'].map((color, i) => (
                <div key={i} style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 16,
                  marginLeft: i > 0 ? -10 : 0,
                  border: '2px solid #FFFFFF',
                }}>
                  {['👩','👨','👩','👨','👩'][i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 1, marginBottom: 3 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#FFD95A', fontSize: 13 }}>★</span>)}
              </div>
              <p style={{ color: '#4B6B57', fontSize: 12 }}>1,000+ learners in early access</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Media ── */}
        <div style={{ animation: 'bloom-rise 0.8s ease 0.15s both', position: 'relative' }}>
          {/* Admin type toggle */}
          {editMode && isAdmin && section && (
            <div style={{ position: 'absolute', top: -44, right: 0, zIndex: 10 }}>
              <HeroTypeToggle type={mediaType} onChange={handleTypeChange} />
            </div>
          )}

          <div className="hero-media" style={{ borderRadius: 28, overflow: 'hidden' }}>
            {mediaType === 'video' && (
              <video
                autoPlay muted loop playsInline
                className="hero-video"
                style={{ width: '100%', borderRadius: 28, display: 'block' }}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            )}
            {mediaType === 'carousel' && <Carousel images={slides} />}
            {mediaType === 'grid' && (
              <BloomGrid images={gridImages} aspectRatio="4/3" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
