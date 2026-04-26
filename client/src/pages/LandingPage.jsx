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
    <div style={{ background: '#0D2318', minHeight: '100vh' }}>
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
              background: 'rgba(110,220,95,0.10)', border: '1px solid rgba(110,220,95,0.22)',
              color: '#6EDC5F', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
              marginBottom: '16px',
            }}>
              WHY IT MATTERS NOW
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.02em', lineHeight: 1.1, color: '#F0FFF4',
            }}>
              The world is changing fast.{' '}
              <span className="bloom-text-green">
                Is your child ready?
              </span>
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
          }} className="why-grid">
            {WHY_NOW_CARDS.map((card, i) => (
              <div key={i} className="bloom-card" style={{
                padding: '28px 22px', transition: 'all 0.25s ease',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(110,220,95,0.25)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(110,220,95,0.12)'; }}
              >
                <div style={{ fontSize: '32px', marginBottom: '14px' }}>{card.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F0FFF4', marginBottom: '10px' }}>
                  {card.title}
                </h3>
                <p style={{ color: 'rgba(168,245,162,0.65)', fontSize: '13px', lineHeight: 1.65 }}>
                  {card.desc}
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
                MEET BLOOM
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 800,
                letterSpacing: '-0.02em', lineHeight: 1.1, color: '#F0FFF4', marginBottom: '20px',
              }}>
                Your child's{' '}
                <span className="bloom-text-green">AI learning buddy</span>
              </h2>
              <p style={{
                color: 'rgba(168,245,162,0.7)', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px',
              }}>
                Bloom isn't a chatbot. Bloom is a personality-driven companion who remembers your
                child's progress, adjusts to their mood, and makes every session feel like an adventure.
              </p>
              {[
                { icon: '🎮', text: 'Keeps children engaged with interactive missions' },
                { icon: '❓', text: 'Encourages asking questions and exploring' },
                { icon: '✅', text: 'Celebrates every win — big and small' },
                { icon: '📈', text: "Adapts to your child's learning pace" },
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
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>🎁</div>
            <h3 style={{
              fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em',
              color: '#F0FFF4', marginBottom: '12px',
            }}>
              Free Guide for Parents
            </h3>
            <p style={{ color: 'rgba(168,245,162,0.7)', fontSize: '15px', lineHeight: 1.65, marginBottom: '28px' }}>
              <strong style={{ color: '#A8F5A2' }}>
                "How to Prepare Your Child for the AI Future"
              </strong>{' '}
              — a practical guide for parents. Free, no spam.
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
            Ready to future-proof your child?
          </h2>
          <p style={{
            color: 'rgba(168,245,162,0.7)', fontSize: '17px', maxWidth: '480px',
            margin: '0 auto 36px',
          }}>
            Book a free demo session. See Bloom in action.
            Watch your child light up in the first 10 minutes.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/book-demo')}
              className="bloom-btn-primary"
              style={{ padding: '16px 36px', fontSize: '17px' }}
            >
              Book Free Demo
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="bloom-btn-ghost"
              style={{ padding: '16px 36px', fontSize: '17px' }}
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
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', color: 'rgba(168,245,162,0.45)', fontSize: '13px', marginBottom: '10px', textDecoration: 'none' }}
            >
              💬 WhatsApp
            </a>
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
