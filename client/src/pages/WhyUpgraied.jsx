import React from 'react';
import { useNavigate } from 'react-router-dom';
import GrowthNavbar from '../components/growth/GrowthNavbar';
import ParentBenefits from '../components/growth/ParentBenefits';
import TrustSection from '../components/growth/TrustSection';
import FAQSection from '../components/growth/FAQSection';
import StickyCTA from '../components/growth/StickyCTA';

const COMPARISONS = [
  {
    label: 'UpgrAIed',
    items: [
      'Interactive AI missions with ROB',
      'Builds real reasoning & confidence',
      'Age-appropriate guided content',
      'Parent dashboard with live reports',
      'Structured learning outcomes',
      'Personality-driven engagement',
    ],
    color: '#7B3FE4',
    highlight: true,
  },
  {
    label: 'Random YouTube / Apps',
    items: [
      'Passive video consumption',
      'No skill outcomes or accountability',
      'Unfiltered, unmoderated content',
      'No visibility for parents',
      'Infinite scroll, no structure',
      'Designed to keep kids addicted',
    ],
    color: 'rgba(255,255,255,0.2)',
    highlight: false,
  },
];

const CURRICULUM = [
  { module: '01', title: 'What is AI?', desc: 'Understanding AI in everyday life. How it works, where it lives.', icon: '🧠' },
  { module: '02', title: 'Talking to AI', desc: 'Prompting as a skill. Getting AI to do what you want.', icon: '💬' },
  { module: '03', title: 'AI Tools Lab', desc: 'Hands-on practice with real AI tools in a safe sandbox.', icon: '🔬' },
  { module: '04', title: 'Creative AI', desc: 'Use AI for art, stories, and invention. Creativity amplified.', icon: '🎨' },
  { module: '05', title: 'AI & Thinking', desc: 'Critical thinking with AI — when to trust it and when not to.', icon: '⚡' },
  { module: '06', title: 'Building with AI', desc: 'Mini-projects: build something real using AI tools.', icon: '🔨' },
];

export default function WhyUpgraied() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <GrowthNavbar />

      {/* PAGE HERO */}
      <section style={{ padding: '130px 32px 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '20%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,63,228,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: '50px',
            background: 'rgba(155,111,244,0.1)', border: '1px solid rgba(155,111,244,0.2)',
            color: '#9B6FF4', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
            marginBottom: '20px',
          }}>
            WHY UPGRAIED
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: '20px',
          }}>
            Not another course platform.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #9B6FF4, #EC4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              A transformation system.
            </span>
          </h1>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.75,
            marginBottom: '40px',
          }}>
            UpgrAIed is built on one belief: children who learn to think with AI
            will outperform every peer who doesn't. We give them the tools, structure,
            and companionship to make that happen.
          </p>
          <button
            onClick={() => navigate('/book-demo')}
            style={{
              padding: '15px 36px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
              color: '#fff', border: 'none', fontWeight: 700, fontSize: '16px',
              cursor: 'pointer', boxShadow: '0 8px 32px rgba(123,63,228,0.4)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Book Free Demo →
          </button>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ padding: '60px 32px 80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800,
              letterSpacing: '-0.02em', color: 'var(--text-primary)',
            }}>
              UpgrAIed vs. The Alternative
            </h2>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
          }} className="compare-grid">
            {COMPARISONS.map((col, i) => (
              <div key={i} style={{
                padding: '32px',
                borderRadius: '24px',
                background: col.highlight
                  ? 'linear-gradient(160deg, rgba(123,63,228,0.12), rgba(236,72,153,0.06))'
                  : 'rgba(20,20,28,0.5)',
                border: col.highlight
                  ? '1px solid rgba(155,111,244,0.3)'
                  : '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px',
                }}>
                  <span style={{ fontSize: '20px' }}>{col.highlight ? '✅' : '❌'}</span>
                  <span style={{
                    fontWeight: 800, fontSize: '17px',
                    color: col.highlight ? '#9B6FF4' : 'var(--text-muted)',
                  }}>
                    {col.label}
                  </span>
                </div>
                {col.items.map((item, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px',
                  }}>
                    <span style={{
                      fontSize: '14px', marginTop: '2px',
                      color: col.highlight ? '#22C55E' : '#555577',
                    }}>
                      {col.highlight ? '→' : '–'}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: col.highlight ? 'var(--text-primary)' : 'var(--text-muted)',
                      lineHeight: 1.5,
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM PREVIEW */}
      <section style={{
        padding: '80px 32px',
        background: 'rgba(12,12,18,0.5)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: '50px',
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
              color: '#3B82F6', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
              marginBottom: '16px',
            }}>
              CURRICULUM PREVIEW
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '14px',
            }}>
              What children actually learn
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              Every module is hands-on, outcome-driven, and built around ROB missions.
            </p>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
          }} className="curriculum-grid">
            {CURRICULUM.map((item, i) => (
              <div key={i} style={{
                padding: '24px', borderRadius: '16px',
                background: 'rgba(26,26,38,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                transition: 'all 0.25s',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(155,111,244,0.2)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div>
                  <div style={{
                    fontSize: '11px', fontWeight: 800, color: '#9B6FF4',
                    letterSpacing: '0.1em', marginBottom: '8px',
                  }}>
                    MODULE {item.module}
                  </div>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
                  <h4 style={{
                    fontSize: '16px', fontWeight: 700,
                    color: 'var(--text-primary)', marginBottom: '8px',
                  }}>
                    {item.title}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              + 6 more modules in Growth & Champion plans
            </p>
          </div>
        </div>
      </section>

      <ParentBenefits />
      <TrustSection />
      <FAQSection />

      {/* CTA */}
      <section style={{ padding: '80px 32px 120px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800,
            letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px',
          }}>
            Enroll your child today
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px' }}>
            The first session is free. No credit card needed.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/book-demo')}
              style={{
                padding: '15px 36px', borderRadius: '50px',
                background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
                color: '#fff', border: 'none', fontWeight: 700, fontSize: '16px',
                cursor: 'pointer', boxShadow: '0 8px 32px rgba(123,63,228,0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🚀 Book Free Demo
            </button>
            <button
              onClick={() => navigate('/pricing')}
              style={{
                padding: '15px 36px', borderRadius: '50px',
                background: 'transparent', color: 'var(--text-primary)',
                border: '1px solid rgba(255,255,255,0.14)', fontWeight: 600,
                fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              See Plans
            </button>
          </div>
        </div>
      </section>

      <StickyCTA />
    </div>
  );
}
