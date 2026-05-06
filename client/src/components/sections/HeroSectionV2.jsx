import { useState, useEffect } from 'react'
import EditableText from '../admin/EditableText'
import EditableImage from '../admin/EditableImage'
import { getContent, updateContent } from '../../services'
import { useEditMode } from '../../context/EditModeContext'

const DEFAULT = {
  badge: '🌱 AI Learning for Ages 8–14',
  headline: 'Learn Your Subjects.\nMaster How to Think with AI.',
  subtext: 'UpgrAIed gives every student a personal AI companion that builds real thinking skills — not just answers.',
  cta: { text: 'Start Learning Free', link: '/reserve' },
  ctaSecondary: { text: 'See How It Works', link: '#why' },
  socialProof: '1,000+ students learning',
  media: { type: 'grid', videoUrl: '', images: [null, null, null, null] },
}

const TILE_PLACEHOLDERS = ['🧒', '📚', '🤖', '✨']

export default function HeroSectionV2() {
  const { editMode, isAdmin } = useEditMode()
  const [content, setContent] = useState(null)

  useEffect(() => {
    getContent('hero').then(d => setContent(d || {})).catch(() => setContent({}))
  }, [])

  const d = { ...DEFAULT, ...content, cta: { ...DEFAULT.cta, ...content?.cta }, ctaSecondary: { ...DEFAULT.ctaSecondary, ...content?.ctaSecondary }, media: { ...DEFAULT.media, ...content?.media } }

  const save = (updated) => {
    setContent(updated)
    if (editMode && isAdmin) updateContent('hero', updated).catch(() => {})
  }

  return (
    <section style={{
      background: '#FFFFFF',
      paddingTop: editMode ? 164 : 120,
      paddingBottom: 80,
      position: 'relative',
      overflow: 'hidden',
      transition: 'padding-top 0.2s ease',
    }}>
      <Blob style={{ top: -120, right: -140, width: 700, height: 700, background: 'radial-gradient(circle, rgba(110,220,95,0.1) 0%, transparent 70%)' }} />
      <Blob style={{ bottom: -60, left: -80, width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,199,255,0.08) 0%, transparent 70%)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

          {/* ── Left: Copy ── */}
          <div style={{ animation: 'bloom-rise 0.6s ease both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'rgba(110,220,95,0.1)', border: '1px solid rgba(110,220,95,0.25)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 24,
            }}>
              <EditableText
                value={d.badge}
                onChange={v => save({ ...d, badge: v })}
                style={{ fontSize: 13, fontWeight: 700, color: '#166B10', letterSpacing: '0.01em' }}
              />
            </div>

            <h1 style={{ fontSize: 'clamp(30px, 3.8vw, 52px)', fontWeight: 800, lineHeight: 1.15, color: '#0D2318', marginBottom: 20, letterSpacing: '-0.025em', whiteSpace: 'pre-line' }}>
              <EditableText
                value={d.headline}
                onChange={v => save({ ...d, headline: v })}
                multiline
                maxLength={200}
              />
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(13,35,24,0.65)', marginBottom: 36, maxWidth: 460 }}>
              <EditableText
                value={d.subtext}
                onChange={v => save({ ...d, subtext: v })}
                multiline
                maxLength={300}
              />
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <HeroButton
                href={d.cta?.link}
                primary
                label={d.cta?.text}
                onLabelChange={v => save({ ...d, cta: { ...d.cta, text: v } })}
              />
              <HeroButton
                href={d.ctaSecondary?.link}
                label={d.ctaSecondary?.text}
                onLabelChange={v => save({ ...d, ctaSecondary: { ...d.ctaSecondary, text: v } })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AvatarStack />
              <div>
                <Stars />
                <EditableText
                  value={d.socialProof}
                  onChange={v => save({ ...d, socialProof: v })}
                  style={{ fontSize: 12, color: 'rgba(13,35,24,0.5)', fontWeight: 600 }}
                />
              </div>
            </div>
          </div>

          {/* ── Right: Media ── */}
          <div style={{ animation: 'bloom-rise 0.65s 0.1s ease both' }}>
            <MediaPanel
              media={d.media}
              onUpdate={(k, v) => save({ ...d, media: { ...d.media, [k]: v } })}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroButton({ href, label, onLabelChange, primary }) {
  const [hov, setHov] = useState(false)
  const base = primary
    ? { background: 'linear-gradient(135deg, #6EDC5F, #4FC840)', color: '#fff', boxShadow: hov ? '0 8px 32px rgba(110,220,95,0.5)' : '0 4px 20px rgba(110,220,95,0.3)' }
    : { background: hov ? 'rgba(110,220,95,0.06)' : 'transparent', color: '#0D2318', border: `2px solid ${hov ? '#6EDC5F' : 'rgba(13,35,24,0.15)'}` }
  return (
    <a
      href={href}
      style={{ ...base, fontWeight: 700, fontSize: 16, padding: '14px 28px', borderRadius: 12, textDecoration: 'none', display: 'inline-block', transition: 'all 0.15s', transform: hov ? 'translateY(-2px)' : 'none' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <EditableText value={label} onChange={onLabelChange} />
    </a>
  )
}

function MediaPanel({ media, onUpdate }) {
  const images = media?.images?.length ? media.images : [null, null, null, null]

  if (media?.type === 'video' && media?.videoUrl) {
    return (
      <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 48px rgba(10,31,18,0.12)', background: '#0D2318', aspectRatio: '16/9' }}>
        <video src={media.videoUrl} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }

  const radii = ['16px 0 0 0', '0 16px 0 0', '0 0 0 16px', '0 0 16px 0']
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 48px rgba(10,31,18,0.1)' }}>
      {images.slice(0, 4).map((img, i) => (
        <EditableImage
          key={i}
          src={img}
          alt={`hero image ${i + 1}`}
          onChange={val => { const imgs = [...images]; imgs[i] = val; onUpdate('images', imgs) }}
          style={{ borderRadius: radii[i], aspectRatio: '1', width: '100%', overflow: 'hidden' }}
        >
          <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', background: i % 2 === 0 ? 'rgba(110,220,95,0.1)' : 'rgba(99,199,255,0.09)' }}>
            {img
              ? <img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
              : <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span style={{ fontSize: 30 }}>{TILE_PLACEHOLDERS[i]}</span>
                  <span style={{ fontSize: 11, color: 'rgba(13,35,24,0.35)', fontWeight: 600 }}>Add image</span>
                </div>
            }
          </div>
        </EditableImage>
      ))}
    </div>
  )
}

function AvatarStack() {
  const emojis = ['🧒', '👦', '👧', '🧒', '👦']
  const colors = ['rgba(110,220,95,0.2)', 'rgba(99,199,255,0.2)', 'rgba(255,217,90,0.2)', 'rgba(110,220,95,0.2)', 'rgba(99,199,255,0.2)']
  return (
    <div style={{ display: 'flex' }}>
      {emojis.map((e, i) => (
        <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: colors[i], border: '2px solid white', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, zIndex: 5 - i }}>
          {e}
        </div>
      ))}
    </div>
  )
}

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 1, marginBottom: 3 }}>
      {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#FFD95A', fontSize: 12 }}>★</span>)}
    </div>
  )
}

function Blob({ style }) {
  return <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', ...style }} />
}
