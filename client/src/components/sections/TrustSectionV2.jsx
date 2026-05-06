import { useState, useEffect } from 'react'
import EditableText from '../admin/EditableText'
import { getContent, updateContent } from '../../services'
import { useEditMode } from '../../context/EditModeContext'

const DEFAULT = {
  badge: 'TRUSTED BY PARENTS',
  title: 'Built for parents who care about how their child learns.',
  stats: [
    { value: '1,000+', label: 'Active Learners' },
    { value: '95%', label: 'Parent Satisfaction' },
    { value: '3×', label: 'Faster Understanding' },
    { value: '0', label: 'Coding Required' },
  ],
  points: [
    { icon: '👁️', title: 'Full Visibility', description: 'Weekly reports show exactly what your child studied, understood, and where they need support.' },
    { icon: '🛡️', title: 'Safe & Age-Appropriate', description: 'Content is filtered and moderated for 8–14 year olds. No inappropriate content, ever.' },
    { icon: '🤝', title: 'Guided AI Learning', description: 'Bloom guides — never just gives answers. Your child must think and engage to progress.' },
    { icon: '📱', title: 'Parent-Friendly Design', description: 'Simple dashboard for parents with no technical knowledge required to monitor progress.' },
    { icon: '📈', title: 'Measurable Progress', description: 'Track concept mastery, XP earned, badges unlocked, and modules completed over time.' },
    { icon: '🌟', title: 'Real Skills for Life', description: 'Students learn to think critically and use AI as a tool — skills that matter in every career.' },
  ],
}

export default function TrustSectionV2() {
  const { editMode, isAdmin } = useEditMode()
  const [content, setContent] = useState(null)

  useEffect(() => {
    getContent('trust').then(d => setContent(d || {})).catch(() => setContent({}))
  }, [])

  const d = {
    ...DEFAULT,
    ...content,
    stats: content?.stats?.length ? content.stats : DEFAULT.stats,
    points: content?.points?.length ? content.points : DEFAULT.points,
  }

  const save = (updated) => {
    setContent(updated)
    if (editMode && isAdmin) updateContent('trust', updated).catch(() => {})
  }

  const updateStat = (i, field, v) => {
    const stats = d.stats.map((s, idx) => idx === i ? { ...s, [field]: v } : s)
    save({ ...d, stats })
  }

  const updatePoint = (i, field, v) => {
    const points = d.points.map((p, idx) => idx === i ? { ...p, [field]: v } : p)
    save({ ...d, points })
  }

  return (
    <section style={{ background: 'linear-gradient(160deg, #F7FFF8 0%, #FFFFFF 60%)', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: '-5%', right: '-3%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(110,220,95,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,217,90,0.18)', borderRadius: 100, padding: '5px 16px', marginBottom: 16 }}>
            <EditableText value={d.badge} onChange={v => save({ ...d, badge: v })} style={{ fontSize: 12, fontWeight: 800, color: '#8A6A00', letterSpacing: '0.08em', textTransform: 'uppercase' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, color: '#0D2318', maxWidth: 600, margin: '0 auto 0', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            <EditableText value={d.title} onChange={v => save({ ...d, title: v })} multiline />
          </h2>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 56 }}>
          {d.stats.map((stat, i) => (
            <div key={i} style={{
              background: '#FFFFFF', borderRadius: 16, padding: '24px 20px', textAlign: 'center',
              boxShadow: '0 2px 16px rgba(10,31,18,0.06), 0 0 0 1px rgba(110,220,95,0.1)',
            }}>
              <div style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, color: '#6EDC5F', letterSpacing: '-0.02em', marginBottom: 6 }}>
                <EditableText value={stat.value} onChange={v => updateStat(i, 'value', v)} />
              </div>
              <div style={{ fontSize: 13, color: 'rgba(13,35,24,0.6)', fontWeight: 600 }}>
                <EditableText value={stat.label} onChange={v => updateStat(i, 'label', v)} />
              </div>
            </div>
          ))}
        </div>

        {/* Trust points grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {d.points.map((point, i) => (
            <TrustPoint
              key={i}
              point={point}
              onIconChange={v => updatePoint(i, 'icon', v)}
              onTitleChange={v => updatePoint(i, 'title', v)}
              onDescChange={v => updatePoint(i, 'description', v)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function TrustPoint({ point, onIconChange, onTitleChange, onDescChange }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16, padding: '24px',
        boxShadow: hov ? '0 6px 24px rgba(10,31,18,0.1)' : '0 2px 12px rgba(10,31,18,0.05)',
        border: `1px solid ${hov ? 'rgba(110,220,95,0.3)' : 'rgba(13,35,24,0.06)'}`,
        transition: 'all 0.2s',
        display: 'flex', gap: 16, alignItems: 'flex-start',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(110,220,95,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
        <EditableText value={point.icon} onChange={onIconChange} style={{ fontSize: 20 }} />
      </div>
      <div>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0D2318', marginBottom: 6 }}>
          <EditableText value={point.title} onChange={onTitleChange} />
        </h4>
        <p style={{ fontSize: 13, color: 'rgba(13,35,24,0.6)', lineHeight: 1.6, margin: 0 }}>
          <EditableText value={point.description} onChange={onDescChange} multiline />
        </p>
      </div>
    </div>
  )
}
