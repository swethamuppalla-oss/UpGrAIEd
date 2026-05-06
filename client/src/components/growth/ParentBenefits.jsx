import React from 'react';
import { useNavigate } from 'react-router-dom';
import BloomCharacter from '../Bloom/BloomCharacter';

const BENEFITS = [
  { icon: '🧠', title: 'Learn concepts clearly',        desc: 'Focus on core principles instead of memorizing facts.', accent: '#6EDC5F', iconClass: '' },
  { icon: '🧩', title: 'Break problems into steps',  desc: 'Tackle complex topics by dividing them into manageable parts.', accent: '#63C7FF', iconClass: 'pg-icon-sky' },
  { icon: '❓', title: 'Ask better questions',       desc: 'Develop the curiosity and logical thinking needed to explore deeply.', accent: '#FFD95A', iconClass: 'pg-icon-warm' },
  { icon: '🤖', title: 'Use AI as a thinking partner',       desc: 'Collaborate with AI to validate ideas and strengthen arguments.', accent: '#FF8A65', iconClass: 'pg-icon-coral' },
];

export default function ParentBenefits() {
  const navigate = useNavigate();

  return (
    <section className="pg-section" style={{ background: '#FFFFFF' }}>
      {/* Ambient orbs */}
      <div className="pg-orb" style={{ top: '-10%', left: '-8%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(110,220,95,0.09), transparent 70%)', filter: 'blur(60px)' }} />
      <div className="pg-orb" style={{ bottom: '-5%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,199,255,0.07), transparent 70%)', filter: 'blur(50px)', animationDelay: '6s', animationDuration: '22s' }} />

      <div className="pg-container">
        {/* Header with Bloom mascot */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center', marginBottom: 64 }}>
          <div>
            <div className="pg-badge">REAL UNDERSTANDING</div>
            <h2 className="pg-h2">
              More Than Studying.{' '}
              <span className="bloom-text-green">Real Understanding.</span>
            </h2>
            <p className="pg-sub" style={{ maxWidth: 500 }}>
              Our system focuses on mastery, teaching students how to think rather than what to memorize.
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <BloomCharacter size="medium" emotion="teaching" speech="Let me show you what you'll learn!" animate />
          </div>
        </div>

        {/* Benefits grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="pg-grid-3">
          {BENEFITS.map((b, i) => (
            <BenefitCard key={i} {...b} delay={i * 0.07} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <button className="bloom-btn-primary" style={{ fontSize: 16, padding: '15px 36px' }} onClick={() => navigate('/book-demo')}>
            See the Full Curriculum →
          </button>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ icon, title, desc, accent, iconClass, delay }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      className="pg-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ padding: 28, animationDelay: `${delay}s` }}
    >
      {/* Glow top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: hov ? `linear-gradient(90deg, transparent, ${accent}60, transparent)` : 'transparent',
        borderRadius: '20px 20px 0 0', transition: 'background 0.3s',
        pointerEvents: 'none',
      }} />
      <div className={`pg-icon ${iconClass}`} style={{ marginBottom: 18, background: hov ? `${accent}22` : undefined, borderColor: hov ? `${accent}44` : undefined }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0A1F12', marginBottom: 10, letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ color: '#4B6B57', fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}
