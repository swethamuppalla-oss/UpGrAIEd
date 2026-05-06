import { useState, useEffect } from 'react'
import EditableText from '../admin/EditableText'
import { getContent, updateContent } from '../../services'
import { useEditMode } from '../../context/EditModeContext'

const DEFAULT = {
  badge: 'GET STARTED TODAY',
  title: 'Give your child a real learning advantage.',
  subtitle: 'Join 1,000+ students already learning smarter with UpgrAIed. Start free — no credit card needed.',
  primaryCta: { text: 'Start Free Trial', link: '/reserve' },
  secondaryCta: { text: 'Chat on WhatsApp', link: '' },
  phone: '919876543210',
  whatsappMessage: 'Hi! I want to learn more about UpgrAIed for my child.',
  trustLine: '✓ 7-day free trial  ·  ✓ No credit card  ·  ✓ Cancel anytime',
}

export default function CTASectionV2() {
  const { editMode, isAdmin } = useEditMode()
  const [content, setContent] = useState(null)

  useEffect(() => {
    getContent('cta').then(d => setContent(d || {})).catch(() => setContent({}))
  }, [])

  const d = {
    ...DEFAULT,
    ...content,
    primaryCta: { ...DEFAULT.primaryCta, ...content?.primaryCta },
    secondaryCta: { ...DEFAULT.secondaryCta, ...content?.secondaryCta },
  }

  const save = (updated) => {
    setContent(updated)
    if (editMode && isAdmin) updateContent('cta', updated).catch(() => {})
  }

  const waLink = `https://wa.me/${d.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(d.whatsappMessage || '')}`

  return (
    <section style={{ background: '#FFFFFF', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(110,220,95,0.05) 0%, rgba(99,199,255,0.04) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(110,220,95,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'inline-block', background: 'rgba(110,220,95,0.12)', borderRadius: 100, padding: '5px 16px', marginBottom: 20 }}>
          <EditableText value={d.badge} onChange={v => save({ ...d, badge: v })} style={{ fontSize: 12, fontWeight: 800, color: '#166B10', letterSpacing: '0.08em', textTransform: 'uppercase' }} />
        </div>

        <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, color: '#0D2318', marginBottom: 20, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          <EditableText value={d.title} onChange={v => save({ ...d, title: v })} multiline />
        </h2>

        <p style={{ fontSize: 18, color: 'rgba(13,35,24,0.6)', lineHeight: 1.65, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
          <EditableText value={d.subtitle} onChange={v => save({ ...d, subtitle: v })} multiline />
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <CTAButton
            href={d.primaryCta?.link}
            primary
            label={d.primaryCta?.text}
            onLabelChange={v => save({ ...d, primaryCta: { ...d.primaryCta, text: v } })}
          />
          <CTAButton
            href={waLink}
            label={d.secondaryCta?.text}
            onLabelChange={v => save({ ...d, secondaryCta: { ...d.secondaryCta, text: v } })}
            icon="💬"
          />
        </div>

        <p style={{ fontSize: 13, color: 'rgba(13,35,24,0.4)', margin: 0 }}>
          <EditableText value={d.trustLine} onChange={v => save({ ...d, trustLine: v })} />
        </p>

        {editMode && isAdmin && (
          <div style={{ marginTop: 24, padding: '16px 20px', background: 'rgba(110,220,95,0.08)', borderRadius: 12, border: '1px dashed rgba(110,220,95,0.4)' }}>
            <p style={{ fontSize: 12, color: 'rgba(13,35,24,0.5)', marginBottom: 8, fontWeight: 600 }}>WhatsApp config</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <label style={{ fontSize: 12, color: 'rgba(13,35,24,0.6)' }}>
                Phone:&nbsp;
                <EditableText value={d.phone} onChange={v => save({ ...d, phone: v })} style={{ fontSize: 12, width: 160 }} />
              </label>
              <label style={{ fontSize: 12, color: 'rgba(13,35,24,0.6)', flex: 1 }}>
                Message:&nbsp;
                <EditableText value={d.whatsappMessage} onChange={v => save({ ...d, whatsappMessage: v })} multiline style={{ fontSize: 12 }} />
              </label>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function CTAButton({ href, label, onLabelChange, primary, icon }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href}
      target={!primary ? '_blank' : undefined}
      rel={!primary ? 'noopener noreferrer' : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: primary ? 'linear-gradient(135deg, #6EDC5F, #4FC840)' : '#FFFFFF',
        color: primary ? '#0D2318' : '#0D2318',
        border: primary ? 'none' : '2px solid rgba(13,35,24,0.15)',
        fontWeight: 700, fontSize: 16,
        padding: '15px 30px', borderRadius: 12,
        textDecoration: 'none',
        boxShadow: primary ? (hov ? '0 10px 40px rgba(110,220,95,0.45)' : '0 4px 24px rgba(110,220,95,0.3)') : (hov ? '0 4px 20px rgba(10,31,18,0.1)' : 'none'),
        transform: hov ? 'translateY(-2px)' : 'none',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {icon && <span>{icon}</span>}
      <EditableText value={label} onChange={onLabelChange} />
    </a>
  )
}
