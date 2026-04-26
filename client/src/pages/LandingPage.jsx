import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GrowthNavbar from '../components/growth/GrowthNavbar';
import HeroSection from '../components/growth/HeroSection';
import ParentBenefits from '../components/growth/ParentBenefits';
import TrustSection from '../components/growth/TrustSection';
import FAQSection from '../components/growth/FAQSection';
import StickyCTA from '../components/growth/StickyCTA';

const WHY_NOW_CARDS = [
  { icon: '🤖', title: 'AI will shape future jobs', desc: 'Over 80% of jobs in 2035 will require AI literacy. The time to build this foundation is now.' },
  { icon: '📉', title: 'Attention spans are shrinking', desc: 'Kids raised on passive content struggle with focus. Structured, active learning rewires that.' },
  { icon: '🎯', title: 'Kids need guidance, not random screens', desc: 'Unguided screen time offers no skill return. UpgrAIed turns that time into compound growth.' },
  { icon: '🏫', title: "Schools don't teach practical AI", desc: 'Curricula are years behind. Parents who act now give their children a meaningful head start.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  function handleEmailSubmit(e) {
    e.preventDefault();
    if (email.trim()) {
      setEmailSent(true);
    }
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <GrowthNavbar />

      {/* HERO */}
      <HeroSection />

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
              background: 'rgba(255,122,47,0.1)', border: '1px solid rgba(255,122,47,0.2)',
              color: '#FF7A2F', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
              marginBottom: '16px',
            }}>
              WHY IT MATTERS NOW
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--text-primary)',
            }}>
              The world is changing fast.{' '}
              <span style={{
                background: 'linear-gradient(135deg, #FF7A2F, #EC4899)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Is your child ready?
              </span>
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
          }} className="why-grid">
            {WHY_NOW_CARDS.map((card, i) => (
              <div key={i} style={{
                padding: '28px 22px', borderRadius: '20px',
                background: 'rgba(26,26,38,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.25s ease',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,122,47,0.2)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div style={{ fontSize: '32px', marginBottom: '14px' }}>{card.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  {card.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.65 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <ParentBenefits />

      {/* ROB STORY */}
      <section style={{
        padding: '80px 32px',
        background: 'linear-gradient(160deg, rgba(123,63,228,0.06) 0%, rgba(236,72,153,0.04) 100%)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '1px', background: 'linear-gradient(90deg, transparent, rgba(155,111,244,0.3), transparent)',
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center',
          }} className="rob-grid">
            {/* ROB visual */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '320px', height: '320px' }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(123,63,228,0.12), rgba(236,72,153,0.08))',
                  border: '1px solid rgba(155,111,244,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'pulse 3s ease-in-out infinite',
                }}>
                  <span style={{ fontSize: '100px', animation: 'robFloat 4s ease-in-out infinite' }}>🤖</span>
                </div>
                {/* Chat bubbles */}
                {[
                  { text: "Great job! 🎉", top: '-5%', right: '-15%', delay: '0s' },
                  { text: "Try this mission!", bottom: '10%', left: '-20%', delay: '1.5s' },
                ].map((b, i) => (
                  <div key={i} style={{
                    position: 'absolute', top: b.top, right: b.right, bottom: b.bottom, left: b.left,
                    padding: '10px 16px', borderRadius: '16px',
                    background: 'rgba(26,26,38,0.95)', border: '1px solid rgba(155,111,244,0.25)',
                    color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600,
                    whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    animation: `robFloat 4s ease-in-out ${b.delay} infinite`,
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
                background: 'rgba(155,111,244,0.1)', border: '1px solid rgba(155,111,244,0.2)',
                color: '#9B6FF4', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
                marginBottom: '20px',
              }}>
                MEET ROB
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 800,
                letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: '20px',
              }}>
                Your child's{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #9B6FF4, #EC4899)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>AI learning buddy</span>
              </h2>
              <p style={{
                color: 'var(--text-secondary)', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px',
              }}>
                ROB isn't a chatbot. ROB is a personality-driven companion who remembers your
                child's progress, adjusts to their mood, and makes every session feel like an adventure.
              </p>
              {[
                { icon: '🎮', text: 'Keeps children engaged with interactive missions' },
                { icon: '❓', text: 'Encourages asking questions and exploring' },
                { icon: '✅', text: 'Celebrates every win — big and small' },
                { icon: '📈', text: 'Adapts to your child\'s learning pace' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(123,63,228,0.12)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ color: 'var(--text-primary)', fontSize: '15px' }}>{item.text}</span>
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
          <div style={{
            padding: '48px 40px', borderRadius: '28px',
            background: 'linear-gradient(160deg, rgba(123,63,228,0.1), rgba(236,72,153,0.06))',
            border: '1px solid rgba(155,111,244,0.2)',
          }}>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>🎁</div>
            <h3 style={{
              fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--text-primary)', marginBottom: '12px',
            }}>
              Free Guide for Parents
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.65, marginBottom: '28px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>
                "How to Prepare Your Child for the AI Future"
              </strong>{' '}
              — a practical guide for parents. Free, no spam.
            </p>
            {emailSent ? (
              <div style={{
                padding: '16px 24px', borderRadius: '12px',
                background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
                color: '#22C55E', fontWeight: 600, fontSize: '15px',
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
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(155,111,244,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="submit"
                  style={{
                    padding: '13px 22px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
                    color: '#fff', border: 'none', fontWeight: 700,
                    fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap',
                    boxShadow: '0 4px 16px rgba(123,63,228,0.35)',
                  }}
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
        <div style={{
          maxWidth: '800px', margin: '0 auto', textAlign: 'center',
          padding: '72px 48px', borderRadius: '32px',
          background: 'linear-gradient(135deg, rgba(123,63,228,0.15) 0%, rgba(236,72,153,0.08) 100%)',
          border: '1px solid rgba(155,111,244,0.2)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '240px', height: '240px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.15), transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{ fontSize: '52px', marginBottom: '20px' }}>🚀</div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
            letterSpacing: '-0.02em', lineHeight: 1.1,
            color: 'var(--text-primary)', marginBottom: '16px',
          }}>
            Ready to future-proof your child?
          </h2>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '17px', maxWidth: '480px',
            margin: '0 auto 36px',
          }}>
            Book a free demo session. See ROB in action.
            Watch your child light up in the first 10 minutes.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/book-demo')}
              style={{
                padding: '16px 36px', borderRadius: '50px',
                background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
                color: '#fff', border: 'none', fontWeight: 700, fontSize: '17px',
                cursor: 'pointer', boxShadow: '0 8px 32px rgba(123,63,228,0.45)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(123,63,228,0.6)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(123,63,228,0.45)'; }}
            >
              🚀 Book Free Demo
            </button>
            <button
              onClick={() => navigate('/pricing')}
              style={{
                padding: '16px 36px', borderRadius: '50px',
                background: 'transparent', color: 'var(--text-primary)',
                border: '1px solid rgba(255,255,255,0.15)', fontWeight: 600,
                fontSize: '17px', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              View Pricing
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

function GrowthFooter() {
  const navigate = useNavigate();
  return (
    <footer style={{
      padding: '48px 32px 100px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '32px',
      }}>
        <div style={{ maxWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }}>🤖</div>
            <span style={{
              fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #9B6FF4, #EC4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>UpgrAIed</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.65 }}>
            Premium AI learning for children aged 8–14. Building the next generation of thinkers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '16px', fontSize: '13px' }}>
              PRODUCT
            </div>
            {['Why UpgrAIed', 'Pricing', 'Book Demo'].map((link, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <span
                  onClick={() => navigate(['/', '/why', '/pricing', '/book-demo'][i + 1] || '/')}
                  style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {link}
                </span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '16px', fontSize: '13px' }}>
              CONTACT
            </div>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '10px', textDecoration: 'none' }}
            >
              💬 WhatsApp
            </a>
            <a
              href="mailto:hello@upgraied.com"
              style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none' }}
            >
              ✉️ hello@upgraied.com
            </a>
          </div>
        </div>
      </div>
      <div style={{
        maxWidth: '1200px', margin: '32px auto 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        paddingTop: '24px', textAlign: 'center',
        color: 'var(--text-muted)', fontSize: '12px',
      }}>
        © 2025 UpgrAIed. All rights reserved. · Built for the next generation.
      </div>
    </footer>
  );
}
