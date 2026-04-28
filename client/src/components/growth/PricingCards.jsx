import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';

const PLANS = [
  {
    name: 'Starter',
    tagline: 'Try the experience',
    price: { monthly: '₹999', annual: '₹799' },
    priceUSD: { monthly: '$12', annual: '$10' },
    emotion: 'happy',
    features: [
      '2 Core Modules',
      'Bloom Learning Buddy',
      '10 Daily Missions',
      'Basic Progress Dashboard',
      'Parent View Included',
      'Mobile Access',
    ],
    notIncluded: ['Parent Reports', 'Priority Support', 'Live Advisor Sessions'],
    accentColor: '#63C7FF',
    accentGrad: 'linear-gradient(135deg, #63C7FF, #A8F5A2)',
  },
  {
    name: 'Growth',
    tagline: 'Most Popular',
    price: { monthly: '₹1,999', annual: '₹1,499' },
    priceUSD: { monthly: '$24', annual: '$18' },
    emotion: 'excited',
    popular: true,
    features: [
      'All 8 Modules',
      'Bloom with Personality Engine',
      'Unlimited Missions + Quizzes',
      'Full Progress Dashboard',
      'Detailed Parent Reports',
      'Badges + Leaderboard',
      'Mobile + Web Access',
      'Email Support',
    ],
    notIncluded: ['Live Advisor Sessions'],
    accentColor: '#6EDC5F',
    accentGrad: 'linear-gradient(135deg, #6EDC5F, #A8F5A2)',
  },
  {
    name: 'Champion',
    tagline: 'Full transformation',
    price: { monthly: '₹3,499', annual: '₹2,799' },
    priceUSD: { monthly: '$42', annual: '$34' },
    emotion: 'celebrating',
    features: [
      'All 12 Modules + Early Access',
      'Advanced Bloom AI Companion',
      'Unlimited Missions + Challenges',
      'Full Progress + Insights',
      'Weekly Parent Reports',
      'Certificates of Achievement',
      '2 Live Advisor Sessions/month',
      'Priority Support',
      'Community Access',
    ],
    notIncluded: [],
    accentColor: '#FFD95A',
    accentGrad: 'linear-gradient(135deg, #FFD95A, #FF8A65)',
  },
];

export default function PricingCards({ compact = false }) {
  const [annual, setAnnual] = useState(true);
  const navigate = useNavigate();
  const config = useConfig();
  
  const plansToUse = config?.pricing?.plans?.length > 0 ? config.pricing.plans : PLANS;

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
        <span style={{ color: annual ? 'rgba(168,245,162,0.55)' : '#F0FFF4', fontSize: 14, fontWeight: 500 }}>Monthly</span>
        <div
          onClick={() => setAnnual(!annual)}
          style={{
            width: 52, height: 28, borderRadius: 50, cursor: 'pointer', position: 'relative',
            background: annual ? 'linear-gradient(135deg, #6EDC5F, #3DAA3A)' : 'rgba(110,220,95,0.15)',
            transition: 'background 0.3s',
            boxShadow: annual ? '0 2px 12px rgba(110,220,95,0.4)' : 'none',
          }}
        >
          <div style={{
            position: 'absolute', top: 3, width: 22, height: 22, borderRadius: '50%', background: '#fff',
            left: annual ? 'calc(100% - 25px)' : 3, transition: 'left 0.3s',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          }} />
        </div>
        <span style={{ color: annual ? '#F0FFF4' : 'rgba(168,245,162,0.55)', fontSize: 14, fontWeight: 500 }}>Annual</span>
        {annual && (
          <span style={{
            padding: '3px 10px', borderRadius: 50,
            background: 'rgba(110,220,95,0.12)', border: '1px solid rgba(110,220,95,0.3)',
            color: '#6EDC5F', fontSize: 12, fontWeight: 700,
          }}>Save 20%</span>
        )}
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }} className="pg-grid-3">
        {plansToUse.map((plan, i) => (
          <PricingCard key={i} plan={plan} annual={annual} onEnroll={() => navigate('/book-demo')} />
        ))}
      </div>
    </div>
  );
}

function PricingCard({ plan, annual, onEnroll }) {
  const price = annual ? plan.price.annual : plan.price.monthly;
  const priceUSD = annual ? plan.priceUSD.annual : plan.priceUSD.monthly;

  return (
    <div className={`pg-price-card${plan.popular ? ' featured' : ''}`}>
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: plan.accentGrad, borderRadius: '24px 24px 0 0',
      }} />

      {plan.popular && (
        <div style={{
          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
          padding: '5px 18px', borderRadius: 50,
          background: 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
          color: '#0A1F12', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(110,220,95,0.45)',
        }}>
          ⭐ Most Popular
        </div>
      )}

      {/* Plan name */}
      <div style={{ marginBottom: 4, paddingTop: plan.popular ? 8 : 0 }}>
        <span style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: 50,
          background: `${plan.accentColor}18`, color: plan.accentColor,
          fontSize: 11, fontWeight: 800, letterSpacing: '0.09em',
        }}>
          {plan.name.toUpperCase()}
        </span>
      </div>
      <div style={{ color: 'rgba(168,245,162,0.55)', fontSize: 13, marginBottom: 16 }}>{plan.tagline}</div>

      {/* Price */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-0.03em', color: '#F0FFF4', lineHeight: 1 }}>
            {price}
          </span>
          <span style={{ color: 'rgba(168,245,162,0.55)', fontSize: 14 }}>/mo</span>
        </div>
        <div style={{ color: 'rgba(168,245,162,0.38)', fontSize: 12, marginTop: 3 }}>
          ≈ {priceUSD}/mo · billed {annual ? 'annually' : 'monthly'}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onEnroll}
        style={{
          width: '100%', padding: '13px 24px', borderRadius: 12, marginBottom: 24,
          background: plan.popular ? 'linear-gradient(135deg, #6EDC5F, #3DAA3A)' : `${plan.accentColor}18`,
          color: plan.popular ? '#0A1F12' : plan.accentColor,
          border: plan.popular ? 'none' : `1px solid ${plan.accentColor}40`,
          fontWeight: 800, fontSize: 15, cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: plan.popular ? '0 6px 24px rgba(110,220,95,0.35)' : 'none',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; if (plan.popular) e.currentTarget.style.boxShadow = '0 10px 32px rgba(110,220,95,0.5)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; if (plan.popular) e.currentTarget.style.boxShadow = '0 6px 24px rgba(110,220,95,0.35)'; }}
      >
        Enroll Now →
      </button>

      {/* Features */}
      <div style={{ borderTop: '1px solid rgba(110,220,95,0.10)', paddingTop: 20, flex: 1 }}>
        {plan.features.map((f, i) => (
          <div key={i} className="pg-feature-row">
            <span className="pg-feature-check">✓</span>
            <span>{f}</span>
          </div>
        ))}
        {plan.notIncluded.map((f, i) => (
          <div key={i} className="pg-feature-row" style={{ opacity: 0.32 }}>
            <span className="pg-feature-x">✕</span>
            <span style={{ textDecoration: 'line-through' }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
