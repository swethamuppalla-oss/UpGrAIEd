import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent, EVENTS } from '../utils/analytics';
import GrowthNavbar from '../components/growth/GrowthNavbar';
import HeroSection from '../components/growth/HeroSection';
import ParentBenefits from '../components/growth/ParentBenefits';
import TrustSection from '../components/growth/TrustSection';
import FAQSection from '../components/growth/FAQSection';
import StickyCTA from '../components/growth/StickyCTA';
import { useConfig } from '../context/ConfigContext';

const DEMO_RESPONSE = `🌿 Photosynthesis is how plants make their own food using sunlight!

Here's the simple breakdown:
• 🌞 Leaves absorb sunlight as an energy source
• 💧 Roots soak up water from the soil
• 🌬️ Leaves take in CO₂ from the air

The plant combines all three → creates sugar (its food) + releases oxygen into the air. That oxygen is what we breathe!

💡 Quick way to remember: plants are tiny solar-powered food factories.

Want to go deeper? Try explaining it back in your own words — that's how you know you really understand it!`;

const HOW_IT_WORKS_STEPS = [
  { icon: '📄', title: 'Upload your school pages', desc: 'Any subject, any syllabus.' },
  { icon: '🧠', title: 'AI builds your learning plan', desc: 'A structured 7-day journey.' },
  { icon: '🎓', title: 'Learn daily with guidance', desc: 'Understand, think, apply.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const config = useConfig();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    trackEvent(EVENTS.LANDING_VIEW);
  }, []);

  function handleEmailSubmit(e) {
    e.preventDefault();
    if (email.trim()) {
      setEmailSent(true);
    }
  }

  return (
    <div style={{ background: '#0D2318', minHeight: '100vh' }}>
      <GrowthNavbar />

      {/* HERO */}
      <HeroSection />

      {/* LIVE DEMO — show value before login */}
      <DemoBlock />

      {/* NOT A COURSE */}
      <section style={{ padding: '0 32px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="ui-card" style={{
            background: 'rgba(22,43,31,0.7)',
            border: '1px solid rgba(110,220,95,0.18)',
            borderRadius: 20,
            padding: '32px 40px',
            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
            color: '#F0FFF4',
          }}>
            <div style={{ fontSize: 40, flexShrink: 0 }}>🌿</div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: '#A8F5A2' }}>
                This is not a course
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(168,245,162,0.75)', lineHeight: 1.65, margin: 0 }}>
                It's a system that helps your child learn any subject better, using structured guidance and AI thinking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY NOW */}
      <section style={{ padding: '80px 32px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '1px', background: 'linear-gradient(90deg, transparent, rgba(155,111,244,0.3), transparent)',
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: '50px',
              background: 'rgba(110,220,95,0.10)', border: '1px solid rgba(110,220,95,0.22)',
              color: '#6EDC5F', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
              marginBottom: '16px',
            }}>
              SIMPLE PROCESS
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.02em', lineHeight: 1.1, color: '#F0FFF4',
            }}>
              <span className="bloom-text-green">
                How It Works
              </span>
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
          }} className="why-grid">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div key={i} className="bloom-card" style={{
                padding: '28px 22px', transition: 'all 0.25s ease', textAlign: 'center'
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(110,220,95,0.25)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(110,220,95,0.12)'; }}
              >
                <div style={{ fontSize: '32px', marginBottom: '14px' }}>{step.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F0FFF4', marginBottom: '10px' }}>
                  {i + 1}. {step.title}
                </h3>
                <p style={{ color: 'rgba(168,245,162,0.65)', fontSize: '14px', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <ParentBenefits />

      {/* BLOOM STORY */}
      <section style={{
        padding: '80px 32px',
        background: 'linear-gradient(160deg, rgba(110,220,95,0.05) 0%, rgba(99,199,255,0.03) 100%)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '1px', background: 'linear-gradient(90deg, transparent, rgba(110,220,95,0.3), transparent)',
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center',
          }} className="rob-grid">
            {/* Bloom visual */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                {/* Glow ring */}
                <div style={{
                  position: 'absolute', inset: '-20px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(110,220,95,0.12), transparent 70%)',
                  animation: 'bloom-pulse-glow 3s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
                {/* Bloom character inline SVG (compact) */}
                <div style={{
                  width: '260px', height: '260px', borderRadius: '50%',
                  background: 'rgba(22,43,31,0.6)',
                  border: '1px solid rgba(110,220,95,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '90px', animation: 'bloom-float 4s ease-in-out infinite', userSelect: 'none' }}>🌿</span>
                </div>
                {/* Chat bubbles */}
                {[
                  { text: "Great job! 🎉", top: '-8%', right: '-20%', delay: '0s' },
                  { text: "Try this mission!", bottom: '8%', left: '-22%', delay: '1.5s' },
                ].map((b, i) => (
                  <div key={i} style={{
                    position: 'absolute', top: b.top, right: b.right, bottom: b.bottom, left: b.left,
                    padding: '10px 16px', borderRadius: '16px',
                    background: 'rgba(22,43,31,0.95)', border: '1px solid rgba(110,220,95,0.25)',
                    color: '#A8F5A2', fontSize: '13px', fontWeight: 600,
                    whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    animation: `bloom-float 4s ease-in-out ${b.delay} infinite`,
                  }}>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Copy */}
            <div>
              <div style={{
                display: 'inline-block', padding: '4px 14px', borderRadius: '50px',
                background: 'rgba(110,220,95,0.10)', border: '1px solid rgba(110,220,95,0.22)',
                color: '#6EDC5F', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
                marginBottom: '20px',
              }}>
                AI THINKING
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 800,
                letterSpacing: '-0.02em', lineHeight: 1.1, color: '#F0FFF4', marginBottom: '20px',
              }}>
                Learn How to{' '}
                <span className="bloom-text-green">Think with AI</span>
              </h2>
              <p style={{
                color: 'rgba(168,245,162,0.7)', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px',
              }}>
                Our system doesn't just give answers. It guides students to break down problems,
                ask better questions, and build strong logical thinking skills.
              </p>
              {[
                { icon: '❓', text: 'Ask better questions' },
                { icon: '🧩', text: 'Solve problems step-by-step' },
                { icon: '🗣️', text: 'Explain concepts clearly' },
                { icon: '🧠', text: 'Build logical thinking' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(110,220,95,0.10)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                    border: '1px solid rgba(110,220,95,0.18)',
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ color: '#A8F5A2', fontSize: '15px' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <TrustSection />

      {/* EMAIL CAPTURE */}
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div className="bloom-hero-card" style={{ padding: '48px 40px' }}>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>🎒</div>
            <h3 style={{
              fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em',
              color: '#F0FFF4', marginBottom: '12px',
            }}>
              For Students
            </h3>
            <p style={{ color: 'rgba(168,245,162,0.7)', fontSize: '15px', lineHeight: 1.65, marginBottom: '28px' }}>
              <strong style={{ color: '#A8F5A2' }}>
                Stop memorizing. Start understanding.
              </strong>{' '}
              Learn step-by-step, ask questions, and build your thinking skills with AI.
            </p>
            {emailSent ? (
              <div style={{
                padding: '16px 24px', borderRadius: '12px',
                background: 'rgba(110,220,95,0.12)', border: '1px solid rgba(110,220,95,0.25)',
                color: '#6EDC5F', fontWeight: 600, fontSize: '15px',
              }}>
                ✅ Check your inbox! Guide is on the way.
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1, padding: '13px 18px', borderRadius: '12px',
                    background: 'rgba(110,220,95,0.06)',
                    border: '1px solid rgba(110,220,95,0.18)',
                    color: '#A8F5A2', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(110,220,95,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(110,220,95,0.18)'}
                />
                <button
                  type="submit"
                  className="bloom-btn-primary"
                  style={{ padding: '13px 22px', fontSize: '14px', whiteSpace: 'nowrap', borderRadius: '12px' }}
                >
                  Send Me the Guide
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '80px 32px 120px' }}>
        <div className="bloom-hero-card" style={{
          maxWidth: '800px', margin: '0 auto', textAlign: 'center',
          padding: '72px 48px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '240px', height: '240px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110,220,95,0.12), transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{ fontSize: '52px', marginBottom: '20px' }}>🌿</div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
            letterSpacing: '-0.02em', lineHeight: 1.1,
            color: '#F0FFF4', marginBottom: '16px',
          }}>
            Start Your Learning Journey
          </h2>
          <p style={{
            color: 'rgba(168,245,162,0.7)', fontSize: '17px', maxWidth: '480px',
            margin: '0 auto 36px',
          }}>
            Upload your first page and see how it works.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login?role=student')}
              className="bloom-btn-primary"
              style={{ padding: '16px 36px', fontSize: '17px' }}
            >
              Start Learning
            </button>
            <button
              onClick={() => navigate('/login?role=parent')}
              className="bloom-btn-ghost"
              style={{ padding: '16px 36px', fontSize: '17px' }}
            >
              For Parents
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <GrowthFooter />
      <StickyCTA />
    </div>
  );
}

function DemoBlock() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('Explain photosynthesis to a 10-year-old');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tried, setTried] = useState(false);

  function handleTry() {
    if (!question.trim() || loading) return;
    if (!tried) trackEvent(EVENTS.AI_FIRST_USE);
    setLoading(true);
    setTried(true);
    setResponse('');
    setTimeout(() => {
      setResponse(DEMO_RESPONSE);
      setLoading(false);
      trackEvent(EVENTS.FIRST_SUCCESS);
    }, 1300);
  }

  return (
    <section style={{ padding: '0 32px 80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Label above card */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 14px', borderRadius: '50px',
            background: 'rgba(110,220,95,0.08)', border: '1px solid rgba(110,220,95,0.2)',
            color: '#6EDC5F', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6EDC5F', display: 'inline-block', boxShadow: '0 0 6px #6EDC5F' }} />
            TRY BLOOM AI — NO LOGIN NEEDED
          </span>
        </div>

        <div style={{
          background: 'rgba(12,28,19,0.95)',
          border: '1px solid rgba(110,220,95,0.22)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          {/* Window chrome */}
          <div style={{
            padding: '12px 20px',
            background: 'rgba(110,220,95,0.06)',
            borderBottom: '1px solid rgba(110,220,95,0.1)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            {['#FF5F57','#FFBD2E','#28C840'].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
            <span style={{ color: 'rgba(168,245,162,0.4)', fontSize: '11px', marginLeft: '8px', fontFamily: 'monospace' }}>
              bloom-ai · live preview
            </span>
          </div>

          {/* Input row */}
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTry()}
                placeholder="Ask anything… e.g. Explain photosynthesis"
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(110,220,95,0.2)',
                  color: '#F0FFF4', fontSize: '14px', outline: 'none',
                  transition: 'border-color 0.2s',
                  minWidth: 0,
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(110,220,95,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(110,220,95,0.2)'}
              />
              <button
                onClick={handleTry}
                disabled={loading}
                className="bloom-btn-scale"
                style={{
                  padding: '12px 20px', borderRadius: '12px',
                  background: loading ? 'rgba(110,220,95,0.35)' : '#6EDC5F',
                  color: '#0A1F12', fontWeight: 700, fontSize: '14px',
                  border: 'none', cursor: loading ? 'default' : 'pointer',
                  transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {loading ? '...' : 'Try Now →'}
              </button>
            </div>
          </div>

          {/* Response area */}
          <div style={{ padding: '16px 20px 20px', minHeight: tried ? '180px' : '72px', display: 'flex', alignItems: tried ? 'flex-start' : 'center' }}>
            {!tried && (
              <p style={{ color: 'rgba(168,245,162,0.3)', fontSize: '13px', margin: 0 }}>
                Hit "Try Now" to see Bloom explain anything, instantly — no account needed.
              </p>
            )}
            {loading && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '8px 0' }}>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: '#6EDC5F',
                    animation: `bloom-pulse-glow 0.8s ease-in-out ${delay}s infinite`,
                  }} />
                ))}
                <span style={{ color: 'rgba(168,245,162,0.45)', fontSize: '12px', marginLeft: '8px' }}>
                  Bloom is thinking…
                </span>
              </div>
            )}
            {!loading && response && (
              <div style={{ animation: 'bloom-rise 0.4s ease both', width: '100%' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                    background: 'rgba(110,220,95,0.12)', border: '1px solid rgba(110,220,95,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                    marginTop: '2px',
                  }}>🌿</div>
                  <p style={{
                    color: '#A8F5A2', fontSize: '14px', lineHeight: '1.75',
                    whiteSpace: 'pre-wrap', margin: 0, flex: 1,
                  }}>
                    {response}
                  </p>
                </div>
                {/* Post-demo conversion nudge */}
                <div style={{
                  marginTop: '16px', padding: '12px 16px', borderRadius: '12px',
                  background: 'rgba(110,220,95,0.07)', border: '1px solid rgba(110,220,95,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: '12px',
                }}>
                  <span style={{ color: 'rgba(168,245,162,0.75)', fontSize: '13px' }}>
                    ✨ Like this? Get a full personalised learning plan for your child.
                  </span>
                  <button
                    onClick={() => navigate('/login?role=student')}
                    className="bloom-btn-scale"
                    style={{
                      padding: '8px 18px', borderRadius: '8px',
                      background: '#6EDC5F', color: '#0A1F12',
                      border: 'none', fontSize: '13px', fontWeight: 700,
                      cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                  >
                    Get Started Free →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function GrowthFooter() {
  const navigate = useNavigate();
  return (
    <footer style={{
      padding: '48px 32px 100px',
      borderTop: '1px solid rgba(110,220,95,0.10)',
      background: '#0A1A10',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '32px',
      }}>
        <div style={{ maxWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
              boxShadow: '0 2px 10px rgba(110,220,95,0.3)',
            }}>🌿</div>
            <span style={{
              fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #A8F5A2, #6EDC5F)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>UpgrAIed</span>
          </div>
          <p style={{ color: 'rgba(168,245,162,0.45)', fontSize: '13px', lineHeight: 1.65 }}>
            Premium AI learning for children aged 8–14. Building the next generation of thinkers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#A8F5A2', fontWeight: 700, marginBottom: '16px', fontSize: '13px' }}>
              PRODUCT
            </div>
            {['Why UpgrAIed', 'Pricing', 'Book Demo'].map((link, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <span
                  onClick={() => navigate(['/why', '/pricing', '/book-demo'][i])}
                  style={{ color: 'rgba(168,245,162,0.45)', fontSize: '13px', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = '#A8F5A2'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(168,245,162,0.45)'}
                >
                  {link}
                </span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: '#A8F5A2', fontWeight: 700, marginBottom: '16px', fontSize: '13px' }}>
              CONTACT
            </div>
            <a
              href="mailto:hello@upgraied.com"
              style={{ display: 'block', color: 'rgba(168,245,162,0.45)', fontSize: '13px', textDecoration: 'none' }}
            >
              ✉️ hello@upgraied.com
            </a>
          </div>
        </div>
      </div>
      <div style={{
        maxWidth: '1200px', margin: '32px auto 0',
        borderTop: '1px solid rgba(110,220,95,0.07)',
        paddingTop: '24px', textAlign: 'center',
        color: 'rgba(168,245,162,0.3)', fontSize: '12px',
      }}>
        © 2025 UpgrAIed. All rights reserved. · Built for the next generation.
      </div>
    </footer>
  );
}
