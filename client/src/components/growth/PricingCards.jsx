import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PLANS = [
  {
    name: 'Starter',
    tagline: 'Try the experience',
    price: { monthly: '₹999', annual: '₹799' },
    priceUSD: { monthly: '$12', annual: '$10' },
    color: '#3B82F6',
    features: [
      { icon: '📦', text: '2 Core Modules' },
      { icon: '🤖', text: 'ROB Learning Buddy' },
      { icon: '🎯', text: '10 Daily Missions' },
      { icon: '📊', text: 'Basic Progress Dashboard' },
      { icon: '👨‍👩‍👧', text: 'Parent View Included' },
      { icon: '📱', text: 'Mobile Access' },
    ],
    notIncluded: ['Parent Reports', 'Priority Support', 'Live Advisor Sessions'],
  },
  {
    name: 'Growth',
    tagline: 'Most Popular',
    price: { monthly: '₹1,999', annual: '₹1,499' },
    priceUSD: { monthly: '$24', annual: '$18' },
    color: '#7B3FE4',
    popular: true,
    features: [
      { icon: '📦', text: 'All 8 Modules' },
      { icon: '🤖', text: 'ROB with Personality Engine' },
      { icon: '🎯', text: 'Unlimited Missions + Quizzes' },
      { icon: '📊', text: 'Full Progress Dashboard' },
      { icon: '👨‍👩‍👧', text: 'Detailed Parent Reports' },
      { icon: '🏆', text: 'Badges + Leaderboard' },
      { icon: '📱', text: 'Mobile + Web Access' },
      { icon: '📧', text: 'Email Support' },
    ],
    notIncluded: ['Live Advisor Sessions'],
  },
  {
    name: 'Champion',
    tagline: 'Full transformation',
    price: { monthly: '₹3,499', annual: '₹2,799' },
    priceUSD: { monthly: '$42', annual: '$34' },
    color: '#FF7A2F',
    features: [
      { icon: '📦', text: 'All 12 Modules + Early Access' },
      { icon: '🤖', text: 'Advanced ROB AI Companion' },
      { icon: '🎯', text: 'Unlimited Missions + Challenges' },
      { icon: '📊', text: 'Full Progress + Insights' },
      { icon: '👨‍👩‍👧', text: 'Weekly Parent Reports' },
      { icon: '🏆', text: 'Certificates of Achievement' },
      { icon: '🎓', text: '2 Live Advisor Sessions/month' },
      { icon: '⚡', text: 'Priority Support' },
      { icon: '🌐', text: 'Community Access' },
    ],
    notIncluded: [],
  },
];

export default function PricingCards({ compact = false }) {
  const [annual, setAnnual] = useState(true);
  const navigate = useNavigate();

  return (
    <div>
      {/* Toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '12px', marginBottom: '48px',
      }}>
        <span style={{ color: annual ? 'var(--text-secondary)' : 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>
          Monthly
        </span>
        <div
          onClick={() => setAnnual(!annual)}
          style={{
            width: '52px', height: '28px', borderRadius: '50px',
            background: annual ? 'linear-gradient(135deg, #7B3FE4, #EC4899)' : 'rgba(255,255,255,0.12)',
            cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
          }}
        >
          <div style={{
            position: 'absolute', top: '3px', width: '22px', height: '22px',
            borderRadius: '50%', background: '#fff',
            left: annual ? 'calc(100% - 25px)' : '3px',
            transition: 'left 0.3s',
          }} />
        </div>
        <span style={{ color: annual ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>
          Annual
        </span>
        {annual && (
          <span style={{
            padding: '3px 10px', borderRadius: '50px',
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
            color: '#22C55E', fontSize: '12px', fontWeight: 700,
          }}>
            Save 20%
          </span>
        )}
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px', alignItems: 'start',
      }} className="pricing-grid">
        {PLANS.map((plan, i) => (
          <PricingCard
            key={i} plan={plan} annual={annual}
            onEnroll={() => navigate('/book-demo')}
          />
        ))}
      </div>
    </div>
  );
}

function PricingCard({ plan, annual, onEnroll }) {
  const [hovered, setHovered] = useState(false);
  const price = annual ? plan.price.annual : plan.price.monthly;
  const priceUSD = annual ? plan.priceUSD.annual : plan.priceUSD.monthly;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '24px',
        background: plan.popular ? `linear-gradient(160deg, rgba(123,63,228,0.12) 0%, rgba(236,72,153,0.06) 100%)` : 'rgba(26,26,38,0.8)',
        border: plan.popular
          ? '1px solid rgba(155,111,244,0.35)'
          : `1px solid ${hovered ? plan.color + '30' : 'rgba(255,255,255,0.07)'}`,
        padding: '32px',
        position: 'relative',
        transition: 'all 0.3s ease',
        transform: plan.popular ? 'scale(1.02)' : hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: plan.popular
          ? '0 20px 60px rgba(123,63,228,0.2)'
          : hovered ? '0 12px 40px rgba(0,0,0,0.2)' : 'none',
      }}
    >
      {plan.popular && (
        <div style={{
          position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
          padding: '5px 18px', borderRadius: '50px',
          background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
          color: '#fff', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(123,63,228,0.4)',
        }}>
          ⭐ Most Popular
        </div>
      )}

      <div style={{ marginBottom: '8px' }}>
        <span style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: '50px',
          background: `${plan.color}15`, color: plan.color,
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
          marginBottom: '12px',
        }}>
          {plan.name.toUpperCase()}
        </span>
      </div>

      <div style={{
        color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px',
      }}>{plan.tagline}</div>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{
            fontSize: '42px', fontWeight: 800, letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}>{price}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>/mo</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
          ≈ {priceUSD}/mo · billed {annual ? 'annually' : 'monthly'}
        </div>
      </div>

      <button
        onClick={onEnroll}
        style={{
          width: '100%', padding: '13px 24px', borderRadius: '12px',
          background: plan.popular
            ? 'linear-gradient(135deg, #7B3FE4, #EC4899)'
            : `${plan.color}20`,
          color: plan.popular ? '#fff' : plan.color,
          border: plan.popular ? 'none' : `1px solid ${plan.color}40`,
          fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginBottom: '28px',
          transition: 'all 0.2s',
          boxShadow: plan.popular ? '0 6px 24px rgba(123,63,228,0.3)' : 'none',
        }}
        onMouseOver={e => { if (plan.popular) e.currentTarget.style.boxShadow = '0 10px 32px rgba(123,63,228,0.5)'; }}
        onMouseOut={e => { if (plan.popular) e.currentTarget.style.boxShadow = '0 6px 24px rgba(123,63,228,0.3)'; }}
      >
        Enroll Now →
      </button>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '12px',
          }}>
            <span style={{ fontSize: '16px' }}>{f.icon}</span>
            <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{f.text}</span>
          </div>
        ))}
        {plan.notIncluded.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '12px', opacity: 0.35,
          }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>✕</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'line-through' }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
