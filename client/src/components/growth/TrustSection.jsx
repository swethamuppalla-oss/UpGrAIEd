import React from 'react';

const TRUST_POINTS = [
  {
    icon: '🛡️',
    title: 'Age-Appropriate Learning',
    desc: 'Every piece of content is curated specifically for ages 8–14. No inappropriate AI outputs, ever.',
    color: '#7B3FE4',
  },
  {
    icon: '👀',
    title: 'Guided AI Usage',
    desc: 'Children learn to use AI with guardrails — supervised, purposeful, and skill-building.',
    color: '#EC4899',
  },
  {
    icon: '📊',
    title: 'Progress Visibility',
    desc: "Parents get a real-time dashboard showing exactly what their child learned, earned, and achieved.",
    color: '#22C55E',
  },
  {
    icon: '📚',
    title: 'Structured Curriculum',
    desc: 'Built by educators, not just engineers. Every module has clear goals, outcomes, and milestones.',
    color: '#FF7A2F',
  },
  {
    icon: '🎓',
    title: 'Real Skills, Not Passive Videos',
    desc: 'Interactive missions > passive watching. Children build, create, and solve every session.',
    color: '#3B82F6',
  },
  {
    icon: '🤝',
    title: 'Parent-Friendly Design',
    desc: 'Easy onboarding, simple controls, and transparent reporting built for busy parents.',
    color: '#9B6FF4',
  },
];

const STATS = [
  { value: '8–14', label: 'Target Age Group', icon: '👧' },
  { value: '95%', label: 'Parent Satisfaction', icon: '⭐' },
  { value: '12+', label: 'Interactive Modules', icon: '📦' },
  { value: '0', label: 'Coding Knowledge Required', icon: '✅' },
];

export default function TrustSection() {
  return (
    <section style={{
      padding: '100px 32px',
      position: 'relative',
      background: 'rgba(12,12,18,0.6)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: '50px',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            color: '#22C55E', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
            marginBottom: '16px',
          }}>
            SAFE · GUIDED · PARENT-FRIENDLY
          </div>
          <h2 style={{
            fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800,
            letterSpacing: '-0.02em', lineHeight: 1.1,
            color: 'var(--text-primary)', marginBottom: '16px',
          }}>
            You're in control.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #22C55E, #3B82F6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Always.</span>
          </h2>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '17px', maxWidth: '480px', margin: '0 auto',
          }}>
            UpgrAIed was built with parents at the design table — not as an afterthought.
          </p>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px', marginBottom: '64px',
        }} className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '24px 20px', borderRadius: '16px', textAlign: 'center',
              background: 'rgba(26,26,38,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{
                fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #9B6FF4, #EC4899)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: '4px',
              }}>{s.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }} className="trust-grid">
          {TRUST_POINTS.map((point, i) => (
            <TrustCard key={i} {...point} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustCard({ icon, title, desc, color }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', gap: '16px', padding: '24px',
        borderRadius: '16px',
        background: hovered ? 'rgba(26,26,38,0.9)' : 'rgba(20,20,30,0.5)',
        border: `1px solid ${hovered ? color + '30' : 'rgba(255,255,255,0.05)'}`,
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div style={{
        width: '44px', height: '44px', flexShrink: 0, borderRadius: '12px',
        background: `${color}15`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '22px',
      }}>
        {icon}
      </div>
      <div>
        <h4 style={{
          fontSize: '15px', fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: '6px',
        }}>{title}</h4>
        <p style={{
          color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6,
        }}>{desc}</p>
      </div>
    </div>
  );
}
