import { useState, useEffect } from 'react'
import EditableText from '../admin/EditableText'
import { getContent, updateContent } from '../../services'
import { useEditMode } from '../../context/EditModeContext'

const DEFAULT = {
  badge: 'SIMPLE PRICING',
  title: 'One plan. Full access.',
  subtitle: 'No hidden fees. Cancel anytime. Your child starts learning immediately.',
  plans: [
    {
      name: 'Free Trial',
      price: '₹0',
      period: '7 days',
      description: 'Try everything free. No card required.',
      featured: false,
      cta: 'Start Free Trial',
      ctaLink: '/reserve',
      features: [
        '1 subject module',
        'AI companion (Bloom)',
        'Basic progress tracking',
        'Parent report (1 week)',
        'Mobile + Desktop access',
      ],
    },
    {
      name: 'Monthly',
      price: '₹999',
      period: 'per month',
      description: 'Full access for one student. Flexible monthly plan.',
      featured: true,
      cta: 'Get Started',
      ctaLink: '/reserve',
      features: [
        'All subjects unlocked',
        'AI companion (Bloom) — unlimited',
        'Weekly parent reports',
        'Progress + XP tracking',
        'Badge system',
        'Priority support',
        'Cancel anytime',
      ],
    },
    {
      name: 'Annual',
      price: '₹799',
      period: 'per month',
      description: 'Best value. Save ₹2,400 vs monthly.',
      featured: false,
      cta: 'Save ₹2,400',
      ctaLink: '/reserve',
      badge: '2 MONTHS FREE',
      features: [
        'Everything in Monthly',
        'Annual learning roadmap',
        'Exam prep modules',
        'Downloadable progress reports',
        'Family discount available',
        'Dedicated onboarding call',
      ],
    },
  ],
}

export default function PricingSectionV2() {
  const { editMode, isAdmin } = useEditMode()
  const [content, setContent] = useState(null)

  useEffect(() => {
    getContent('pricing').then(d => setContent(d || {})).catch(() => setContent({}))
  }, [])

  const d = {
    ...DEFAULT,
    ...content,
    plans: content?.plans?.length ? content.plans : DEFAULT.plans,
  }

  const save = (updated) => {
    setContent(updated)
    if (editMode && isAdmin) updateContent('pricing', updated).catch(() => {})
  }

  const updatePlan = (i, field, value) => {
    const plans = d.plans.map((p, idx) => idx === i ? { ...p, [field]: value } : p)
    save({ ...d, plans })
  }

  const updateFeature = (planIdx, featIdx, value) => {
    const plans = d.plans.map((p, pi) => {
      if (pi !== planIdx) return p
      const features = p.features.map((f, fi) => fi === featIdx ? value : f)
      return { ...p, features }
    })
    save({ ...d, plans })
  }

  return (
    <section id="pricing" style={{ background: '#FFFFFF', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '5%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(110,220,95,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: 'rgba(110,220,95,0.12)', borderRadius: 100, padding: '5px 16px', marginBottom: 16 }}>
            <EditableText value={d.badge} onChange={v => save({ ...d, badge: v })} style={{ fontSize: 12, fontWeight: 800, color: '#166B10', letterSpacing: '0.08em', textTransform: 'uppercase' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 44px)', fontWeight: 800, color: '#0D2318', marginBottom: 12, letterSpacing: '-0.02em' }}>
            <EditableText value={d.title} onChange={v => save({ ...d, title: v })} />
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(13,35,24,0.6)', maxWidth: 480, margin: '0 auto' }}>
            <EditableText value={d.subtitle} onChange={v => save({ ...d, subtitle: v })} multiline />
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }}>
          {d.plans.map((plan, i) => (
            <PricingCard
              key={i}
              plan={plan}
              onNameChange={v => updatePlan(i, 'name', v)}
              onPriceChange={v => updatePlan(i, 'price', v)}
              onPeriodChange={v => updatePlan(i, 'period', v)}
              onDescChange={v => updatePlan(i, 'description', v)}
              onCtaChange={v => updatePlan(i, 'cta', v)}
              onFeatureChange={(fi, v) => updateFeature(i, fi, v)}
            />
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: 'rgba(13,35,24,0.45)' }}>
          All prices in INR. GST applicable. Secure payment via Razorpay.
        </p>
      </div>
    </section>
  )
}

function PricingCard({ plan, onNameChange, onPriceChange, onPeriodChange, onDescChange, onCtaChange, onFeatureChange }) {
  const [hov, setHov] = useState(false)

  return (
    <div
      style={{
        borderRadius: 20,
        padding: plan.featured ? '32px 28px' : '28px 24px',
        background: plan.featured ? 'linear-gradient(160deg, #0D2318 0%, #163D24 100%)' : '#FFFFFF',
        boxShadow: plan.featured
          ? '0 16px 64px rgba(10,31,18,0.25), 0 0 0 1px rgba(110,220,95,0.2)'
          : hov ? '0 8px 32px rgba(10,31,18,0.1)' : '0 2px 16px rgba(10,31,18,0.06)',
        border: plan.featured ? 'none' : `1px solid ${hov ? 'rgba(110,220,95,0.3)' : 'rgba(13,35,24,0.07)'}`,
        transition: 'all 0.2s',
        transform: plan.featured ? 'scale(1.03)' : hov ? 'translateY(-4px)' : 'none',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {plan.featured && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #6EDC5F, #4FC840)',
          color: '#0D2318', fontSize: 11, fontWeight: 800,
          padding: '4px 16px', borderRadius: 100,
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
        }}>
          MOST POPULAR
        </div>
      )}

      {plan.badge && !plan.featured && (
        <div style={{
          display: 'inline-block', background: 'rgba(255,217,90,0.18)', borderRadius: 100,
          padding: '3px 12px', marginBottom: 12,
          fontSize: 11, fontWeight: 800, color: '#8A6A00', letterSpacing: '0.06em',
        }}>
          {plan.badge}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: plan.featured ? '#A8F5A2' : 'rgba(13,35,24,0.6)', marginBottom: 12, letterSpacing: '0.02em' }}>
          <EditableText value={plan.name} onChange={onNameChange} />
        </h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 'clamp(32px, 3.5vw, 44px)', fontWeight: 800, color: plan.featured ? '#FFFFFF' : '#0D2318', letterSpacing: '-0.03em' }}>
            <EditableText value={plan.price} onChange={onPriceChange} />
          </span>
          <span style={{ fontSize: 14, color: plan.featured ? 'rgba(255,255,255,0.5)' : 'rgba(13,35,24,0.45)', fontWeight: 500 }}>
            / <EditableText value={plan.period} onChange={onPeriodChange} />
          </span>
        </div>
        <p style={{ fontSize: 13, color: plan.featured ? 'rgba(255,255,255,0.6)' : 'rgba(13,35,24,0.55)', lineHeight: 1.5, margin: 0 }}>
          <EditableText value={plan.description} onChange={onDescChange} multiline />
        </p>
      </div>

      <div style={{ borderTop: `1px solid ${plan.featured ? 'rgba(255,255,255,0.1)' : 'rgba(13,35,24,0.07)'}`, paddingTop: 20, marginBottom: 24, flex: 1 }}>
        {(plan.features || []).map((feat, fi) => (
          <div key={fi} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <span style={{ color: '#6EDC5F', fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 13, color: plan.featured ? 'rgba(255,255,255,0.8)' : 'rgba(13,35,24,0.7)', lineHeight: 1.5 }}>
              <EditableText value={feat} onChange={v => onFeatureChange(fi, v)} />
            </span>
          </div>
        ))}
      </div>

      <a
        href={plan.ctaLink || '/reserve'}
        style={{
          display: 'block', textAlign: 'center',
          background: plan.featured ? 'linear-gradient(135deg, #6EDC5F, #4FC840)' : 'transparent',
          color: plan.featured ? '#0D2318' : '#0D2318',
          border: plan.featured ? 'none' : '2px solid #6EDC5F',
          borderRadius: 12, padding: '13px 20px',
          fontWeight: 700, fontSize: 15,
          textDecoration: 'none',
          transition: 'all 0.15s',
          boxShadow: plan.featured ? '0 4px 20px rgba(110,220,95,0.35)' : 'none',
        }}
      >
        <EditableText value={plan.cta} onChange={onCtaChange} />
      </a>
    </div>
  )
}
