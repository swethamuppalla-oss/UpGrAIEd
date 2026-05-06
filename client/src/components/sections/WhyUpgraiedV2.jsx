import { useState, useEffect } from 'react'
import EditableText from '../admin/EditableText'
import { getContent, updateContent } from '../../services'
import { useEditMode } from '../../context/EditModeContext'

const DEFAULT = {
  badge: 'WHY UPGRAIED',
  title: 'More than studying.\nReal understanding.',
  subtitle: 'We built a learning experience designed around how children actually think.',
  cards: [
    { icon: '🧠', title: 'Think, Don\'t Memorize', description: 'AI walks students through concepts step-by-step, building genuine understanding instead of rote learning.', color: '#6EDC5F' },
    { icon: '📸', title: 'Upload Anything', description: 'Photos of textbooks, handwritten notes, or typed questions — Bloom handles it all and creates a learning plan.', color: '#63C7FF' },
    { icon: '🎯', title: 'Personalized Path', description: 'Every student gets a unique 7-day learning journey adapted to their pace, grade, and subject.', color: '#FFD95A' },
    { icon: '💬', title: 'Ask Without Judgment', description: 'Students can ask the same question 10 times. Bloom never gets frustrated. Always patient, always clear.', color: '#FF8A65' },
    { icon: '📊', title: 'Parent Visibility', description: 'Weekly progress reports so parents know exactly what their child has learned and where they need support.', color: '#6EDC5F' },
    { icon: '🏆', title: 'Real Skill Building', description: 'Bloom teaches critical thinking, problem decomposition, and how to use AI as a thinking partner for life.', color: '#63C7FF' },
  ],
}

export default function WhyUpgraiedV2() {
  const { editMode, isAdmin } = useEditMode()
  const [content, setContent] = useState(null)

  useEffect(() => {
    getContent('why').then(d => setContent(d || {})).catch(() => setContent({}))
  }, [])

  const d = {
    ...DEFAULT,
    ...content,
    cards: content?.cards?.length ? content.cards : DEFAULT.cards,
  }

  const save = (updated) => {
    setContent(updated)
    if (editMode && isAdmin) updateContent('why', updated).catch(() => {})
  }

  const updateCard = (i, field, value) => {
    const cards = d.cards.map((c, idx) => idx === i ? { ...c, [field]: value } : c)
    save({ ...d, cards })
  }

  return (
    <section id="why" style={{ background: '#FFFFFF', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,199,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: 'rgba(99,199,255,0.12)', borderRadius: 100, padding: '5px 16px', marginBottom: 16 }}>
            <EditableText value={d.badge} onChange={v => save({ ...d, badge: v })} style={{ fontSize: 12, fontWeight: 800, color: '#0A6B8A', letterSpacing: '0.08em', textTransform: 'uppercase' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 44px)', fontWeight: 800, color: '#0D2318', marginBottom: 16, letterSpacing: '-0.02em', whiteSpace: 'pre-line' }}>
            <EditableText value={d.title} onChange={v => save({ ...d, title: v })} multiline />
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(13,35,24,0.6)', maxWidth: 500, margin: '0 auto' }}>
            <EditableText value={d.subtitle} onChange={v => save({ ...d, subtitle: v })} multiline />
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {d.cards.map((card, i) => (
            <WhyCard
              key={i}
              card={card}
              delay={i * 0.07}
              onTitleChange={v => updateCard(i, 'title', v)}
              onDescChange={v => updateCard(i, 'description', v)}
              onIconChange={v => updateCard(i, 'icon', v)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyCard({ card, delay, onTitleChange, onDescChange, onIconChange }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1px solid ${hov ? card.color || '#6EDC5F' : 'rgba(13,35,24,0.07)'}`,
        borderRadius: 20,
        padding: '28px 24px',
        boxShadow: hov ? `0 8px 32px rgba(10,31,18,0.1), 0 0 0 1px ${card.color || '#6EDC5F'}33` : '0 2px 12px rgba(10,31,18,0.05)',
        transition: 'all 0.2s ease',
        transform: hov ? 'translateY(-4px)' : 'none',
        animation: `bloom-rise 0.5s ${delay}s ease both`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {hov && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: card.color || '#6EDC5F', borderRadius: '20px 20px 0 0' }} />
      )}

      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `${card.color || '#6EDC5F'}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, marginBottom: 16,
      }}>
        <EditableText value={card.icon} onChange={onIconChange} style={{ fontSize: 24 }} />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0D2318', marginBottom: 10, lineHeight: 1.35 }}>
        <EditableText value={card.title} onChange={onTitleChange} />
      </h3>
      <p style={{ fontSize: 14, color: 'rgba(13,35,24,0.6)', lineHeight: 1.65, margin: 0 }}>
        <EditableText value={card.description} onChange={onDescChange} multiline />
      </p>
    </div>
  )
}
