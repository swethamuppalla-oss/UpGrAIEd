import React from 'react';
import { useNavigate } from 'react-router-dom';
import BloomCharacter from '../Bloom/BloomCharacter';

const BENEFITS = [
  { icon: '🧠', title: 'AI Skills',        desc: 'Learn to think with AI tools the right way — not as a shortcut, but as a superpower.', accent: '#6EDC5F', iconClass: '' },
  { icon: '💡', title: 'Better Thinking',  desc: 'Problem-solving frameworks and structured reasoning that lift performance across all subjects.', accent: '#63C7FF', iconClass: 'pg-icon-sky' },
  { icon: '🦁', title: 'Confidence',       desc: 'Celebrate wins, earn badges, and build a track record your child can be proud of.', accent: '#FFD95A', iconClass: 'pg-icon-warm' },
  { icon: '🎯', title: 'Discipline',       desc: 'Structured missions and daily goals build habits that last a lifetime — not just streaks.', accent: '#FF8A65', iconClass: 'pg-icon-coral' },
  { icon: '🗣️', title: 'Communication',   desc: 'Express ideas clearly — to humans and AI — through guided prompting and articulation practice.', accent: '#63C7FF', iconClass: 'pg-icon-sky' },
  { icon: '🎨', title: 'Creativity',       desc: 'Use AI as a canvas. Invent, build, and imagine things that were impossible before.', accent: '#6EDC5F', iconClass: '' },
];

export default function ParentBenefits() {
  const navigate = useNavigate();

  return (
    <section className="pg-section" style={{ background: '#0D2318' }}>
      {/* Ambient orbs */}
      <div className="pg-orb" style={{ top: '-10%', left: '-8%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(110,220,95,0.09), transparent 70%)', filter: 'blur(60px)' }} />
      <div className="pg-orb" style={{ bottom: '-5%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,199,255,0.07), transparent 70%)', filter: 'blur(50px)', animationDelay: '6s', animationDuration: '22s' }} />

      <div className="pg-container">
        {/* Header with Bloom mascot */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center', marginBottom: 64 }}>
          <div>
            <div className="pg-badge">WHAT YOUR CHILD GAINS</div>
            <h2 className="pg-h2">
              Six skills that shape a{' '}
              <span className="bloom-text-green">remarkable future</span>
            </h2>
            <p className="pg-sub" style={{ maxWidth: 500 }}>
              Every module develops compound skills — things that make every other skill better.
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
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F0FFF4', marginBottom: 10, letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ color: 'rgba(168,245,162,0.68)', fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}
