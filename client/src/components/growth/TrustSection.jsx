import React from 'react';
import BloomCharacter from '../Bloom/BloomCharacter';

const TRUST_POINTS = [
  { icon: '🛡️', title: 'Age-Appropriate Learning',     desc: 'Every piece of content is curated for ages 8–14. No inappropriate AI outputs, ever.', iconClass: '' },
  { icon: '👀', title: 'Guided AI Usage',               desc: 'Children learn to use AI with guardrails — supervised, purposeful, and skill-building.', iconClass: 'pg-icon-sky' },
  { icon: '📊', title: 'Progress Visibility',           desc: 'Parents get a real-time dashboard showing exactly what their child learned and achieved.', iconClass: 'pg-icon-warm' },
  { icon: '📚', title: 'Structured Curriculum',         desc: 'Built by educators, not just engineers. Every module has clear goals and milestones.', iconClass: '' },
  { icon: '🎓', title: 'Real Skills, Not Passive Videos', desc: 'Interactive missions > passive watching. Children build and solve every session.', iconClass: 'pg-icon-sky' },
  { icon: '🤝', title: 'Parent-Friendly Design',        desc: 'Easy onboarding, simple controls, and transparent reporting built for busy parents.', iconClass: 'pg-icon-warm' },
];

const STATS = [
  { value: '8–14', label: 'Target Age Group', icon: '👧', delay: 0 },
  { value: '95%',  label: 'Parent Satisfaction', icon: '⭐', delay: 0.1 },
  { value: '12+',  label: 'Interactive Modules', icon: '📦', delay: 0.2 },
  { value: '0',    label: 'Coding Knowledge Required', icon: '✅', delay: 0.3 },
];

export default function TrustSection() {
  return (
    <section className="pg-section pg-section-alt">
      {/* Ambient orbs */}
      <div className="pg-orb" style={{ top: '10%', right: '-6%', width: 450, height: 450, background: 'radial-gradient(circle, rgba(99,199,255,0.08), transparent 70%)', filter: 'blur(55px)', animationDuration: '20s' }} />
      <div className="pg-orb" style={{ bottom: '5%', left: '-4%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(110,220,95,0.07), transparent 70%)', filter: 'blur(45px)', animationDelay: '9s' }} />

      <div className="pg-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="pg-badge pg-badge-sky">SAFE · GUIDED · PARENT-FRIENDLY</div>
          <h2 className="pg-h2">
            You're in control.{' '}
            <span className="bloom-text-sky">Always.</span>
          </h2>
          <p className="pg-sub" style={{ maxWidth: 480, margin: '0 auto' }}>
            UpgrAIed was built with parents at the design table — not as an afterthought.
          </p>
        </div>

        {/* Stats + Bloom mascot row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'center', marginBottom: 64 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {STATS.slice(0, 2).map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>
          <BloomCharacter size="medium" emotion="happy" speech="Parents can see everything! 📊" animate />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {STATS.slice(2).map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="bloom-divider" style={{ marginBottom: 48 }} />

        {/* Trust grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="pg-grid-3">
          {TRUST_POINTS.map((point, i) => (
            <TrustCard key={i} {...point} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, value, label, delay }) {
  return (
    <div className="pg-stat-card" style={{ animationDelay: `${delay}s` }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div className="pg-stat-value">{value}</div>
      <div className="pg-stat-label">{label}</div>
    </div>
  );
}

function TrustCard({ icon, title, desc, iconClass }) {
  return (
    <div className="pg-card" style={{ display: 'flex', gap: 16, padding: 24 }}>
      <div className={`pg-icon ${iconClass}`} style={{ width: 44, height: 44, fontSize: 22 }}>
        {icon}
      </div>
      <div>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#F0FFF4', marginBottom: 6 }}>{title}</h4>
        <p style={{ color: 'rgba(168,245,162,0.65)', fontSize: 13, lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  );
}
