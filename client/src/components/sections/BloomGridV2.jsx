import { useState, useEffect } from 'react'
import EditableText from '../admin/EditableText'
import EditableImage from '../admin/EditableImage'
import { getContent, updateContent } from '../../services'
import { useEditMode } from '../../context/EditModeContext'

const DEFAULT = {
  badge: 'HOW IT WORKS',
  title: 'Learning that actually sticks',
  subtitle: 'Every session is structured around how kids actually think and learn.',
  tiles: [
    { image: null, label: 'Upload Your Notes', badge: '01' },
    { image: null, label: 'AI Builds Your Plan', badge: '02' },
    { image: null, label: 'Learn & Practice', badge: '03' },
    { image: null, label: 'Track Progress', badge: '04' },
    { image: null, label: 'Ask Anything', badge: '05' },
    { image: null, label: 'Earn Badges', badge: '06' },
  ],
}

export default function BloomGridV2() {
  const { editMode, isAdmin } = useEditMode()
  const [content, setContent] = useState(null)

  useEffect(() => {
    getContent('bloomGrid').then(d => setContent(d || {})).catch(() => setContent({}))
  }, [])

  const d = {
    ...DEFAULT,
    ...content,
    tiles: content?.tiles?.length ? content.tiles : DEFAULT.tiles,
  }

  const save = (updated) => {
    setContent(updated)
    if (editMode && isAdmin) updateContent('bloomGrid', updated).catch(() => {})
  }

  const updateTile = (i, field, value) => {
    const tiles = d.tiles.map((t, idx) => idx === i ? { ...t, [field]: value } : t)
    save({ ...d, tiles })
  }

  return (
    <section style={{ background: '#F7FFF8', padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <SectionHeader
          badge={d.badge}
          title={d.title}
          subtitle={d.subtitle}
          onBadgeChange={v => save({ ...d, badge: v })}
          onTitleChange={v => save({ ...d, title: v })}
          onSubtitleChange={v => save({ ...d, subtitle: v })}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }}>
          {d.tiles.map((tile, i) => (
            <BloomTile
              key={i}
              tile={tile}
              onImageChange={v => updateTile(i, 'image', v)}
              onLabelChange={v => updateTile(i, 'label', v)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function BloomTile({ tile, onImageChange, onLabelChange }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: '#FFFFFF',
        boxShadow: hov ? '0 8px 32px rgba(10,31,18,0.12)' : '0 2px 16px rgba(10,31,18,0.06)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        transform: hov ? 'translateY(-4px)' : 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <EditableImage
        src={tile.image}
        alt={tile.label}
        onChange={onImageChange}
        style={{ borderRadius: '16px 16px 0 0', width: '100%', overflow: 'hidden' }}
      >
        <div style={{ width: '100%', paddingBottom: '75%', position: 'relative', background: 'linear-gradient(135deg, rgba(110,220,95,0.1), rgba(99,199,255,0.08))' }}>
          {tile.image
            ? <img src={tile.image} alt={tile.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 40 }}>🖼️</span>
              </div>
          }
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: '#6EDC5F', color: '#0D2318',
            fontSize: 11, fontWeight: 800,
            padding: '3px 10px', borderRadius: 100,
            letterSpacing: '0.05em',
          }}>
            {tile.badge}
          </div>
        </div>
      </EditableImage>

      <div style={{ padding: '16px 20px' }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#0D2318', margin: 0 }}>
          <EditableText value={tile.label} onChange={onLabelChange} />
        </p>
      </div>
    </div>
  )
}

function SectionHeader({ badge, title, subtitle, onBadgeChange, onTitleChange, onSubtitleChange }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <div style={{ display: 'inline-block', background: 'rgba(110,220,95,0.15)', borderRadius: 100, padding: '5px 16px', marginBottom: 16 }}>
        <EditableText value={badge} onChange={onBadgeChange} style={{ fontSize: 12, fontWeight: 800, color: '#166B10', letterSpacing: '0.08em', textTransform: 'uppercase' }} />
      </div>
      <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 800, color: '#0D2318', marginBottom: 12, letterSpacing: '-0.02em' }}>
        <EditableText value={title} onChange={onTitleChange} />
      </h2>
      <p style={{ fontSize: 17, color: 'rgba(13,35,24,0.6)', maxWidth: 520, margin: '0 auto' }}>
        <EditableText value={subtitle} onChange={onSubtitleChange} multiline />
      </p>
    </div>
  )
}
