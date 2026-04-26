import React from 'react';
import { useNavigate } from 'react-router-dom';

const BENEFITS = [
  {
    icon: '🧠',
    title: 'AI Skills',
    desc: 'Learn to think with AI tools the right way — not as a shortcut, but as a superpower.',
    color: '#7B3FE4',
  },
  {
    icon: '💡',
    title: 'Better Thinking',
    desc: 'Problem-solving frameworks and structured reasoning that improve performance across all subjects.',
    color: '#9B6FF4',
  },
  {
    icon: '🦁',
    title: 'Confidence',
    desc: 'Celebrate wins, earn badges, and build a track record your child can be proud of.',
    color: '#EC4899',
  },
  {
    icon: '🎯',
    title: 'Discipline',
    desc: 'Structured missions and daily goals build habits that last a lifetime — not just streaks.',
    color: '#FF7A2F',
  },
  {
    icon: '🗣️',
    title: 'Communication',
    desc: 'Express ideas clearly — to humans and AI — through guided prompting and articulation practice.',
    color: '#3B82F6',
  },
  {
    icon: '🎨',
    title: 'Creativity',
    desc: 'Use AI as a canvas. Invent, build, and imagine things that were impossible before.',
    color: '#22C55E',
  },
];

export default function ParentBenefits() {
  const navigate = useNavigate();

  return (
    <section style={{
      padding: '100px 32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: '50px',
            background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)',
            color: '#EC4899', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
            marginBottom: '16px',
          }}>
            WHAT YOUR CHILD GAINS
          </div>
          <h2 style={{
            fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800,
            letterSpacing: '-0.02em', lineHeight: 1.1,
            color: 'var(--text-primary)', marginBottom: '16px',
          }}>
            Six skills that shape a{' '}
            <span style={{
              background: 'linear-gradient(135deg, #9B6FF4, #EC4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>remarkable future</span>
          </h2>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '17px', maxWidth: '500px', margin: '0 auto',
          }}>
            Every module is designed to develop compound skills — things that make every other skill better.
          </p>
        </div>

        {/* Benefits Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }} className="benefits-grid">
          {BENEFITS.map((b, i) => (
            <BenefitCard key={i} {...b} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <button
            onClick={() => navigate('/book-demo')}
            style={{
              padding: '15px 36px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
              color: '#fff', border: 'none', fontWeight: 700,
              fontSize: '16px', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(123,63,228,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(123,63,228,0.5)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(123,63,228,0.35)'; }}
          >
            See the Full Curriculum →
          </button>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ icon, title, desc, color, index }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '28px',
        borderRadius: '20px',
        background: hovered ? 'rgba(30,30,46,0.9)' : 'rgba(26,26,38,0.7)',
        border: hovered ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px ${color}20` : 'none',
        cursor: 'default',
        animation: `heroRise 0.6s ease ${index * 0.08}s both`,
      }}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: '14px',
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '26px', marginBottom: '18px',
        transition: 'transform 0.2s',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '18px', fontWeight: 700,
        color: 'var(--text-primary)', marginBottom: '10px',
        letterSpacing: '-0.01em',
      }}>{title}</h3>
      <p style={{
        color: 'var(--text-secondary)', fontSize: '14px',
        lineHeight: 1.65,
      }}>{desc}</p>
    </div>
  );
}
