import React from 'react';
import { useNavigate } from 'react-router-dom';
import GrowthNavbar from '../components/growth/GrowthNavbar';
import PricingCards from '../components/growth/PricingCards';
import FAQSection from '../components/growth/FAQSection';
import StickyCTA from '../components/growth/StickyCTA';

const GUARANTEE_POINTS = [
  { icon: '🎁', title: 'Free Demo First', desc: 'Try a full demo session before any payment. See ROB in action.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'All transactions are SSL-secured and processed via Razorpay.' },
  { icon: '📞', title: 'Advisor Support', desc: 'Human advisors are available on WhatsApp for any questions.' },
  { icon: '🔄', title: 'Easy Cancellation', desc: 'No lock-ins. Cancel anytime from your parent dashboard.' },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <GrowthNavbar />

      {/* PAGE HERO */}
      <section style={{ padding: '130px 32px 60px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '0%', left: '30%',
          width: '600px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,63,228,0.1), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: '50px',
            background: 'rgba(255,122,47,0.1)', border: '1px solid rgba(255,122,47,0.2)',
            color: '#FF7A2F', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
            marginBottom: '20px',
          }}>
            SIMPLE, TRANSPARENT PRICING
          </div>
          <h1 style={{
            fontSize: 'clamp(34px, 4.5vw, 60px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: '18px',
          }}>
            Invest in your child's{' '}
            <span style={{
              background: 'linear-gradient(135deg, #9B6FF4, #FF7A2F)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>future skills</span>
          </h1>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '17px', lineHeight: 1.7,
          }}>
            No hidden fees. No pressure. Start with a free demo and upgrade when you're ready.
          </p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section style={{ padding: '20px 32px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <PricingCards />
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{
        padding: '80px 32px',
        background: 'rgba(12,12,18,0.5)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800,
              letterSpacing: '-0.02em', color: 'var(--text-primary)',
            }}>
              Every plan includes
            </h2>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
          }} className="includes-grid">
            {[
              { icon: '🤖', title: 'ROB AI Companion', desc: 'Personality-driven buddy who adapts to your child.' },
              { icon: '📊', title: 'Parent Dashboard', desc: 'See progress, time spent, and achievements live.' },
              { icon: '🎯', title: 'Daily Missions', desc: 'Structured tasks that build real skills session by session.' },
              { icon: '🏆', title: 'Badges & XP', desc: 'Gamified rewards that keep children motivated.' },
              { icon: '📱', title: 'Mobile Access', desc: 'Learn on any device — phone, tablet, or desktop.' },
              { icon: '🔒', title: 'Safe Environment', desc: 'Zero unfiltered AI, zero inappropriate content.' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '22px', borderRadius: '16px',
                background: 'rgba(26,26,38,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', gap: '14px',
              }}>
                <div style={{
                  fontSize: '24px', width: '44px', height: '44px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '12px', background: 'rgba(123,63,228,0.12)',
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{
                    fontWeight: 700, fontSize: '14px',
                    color: 'var(--text-primary)', marginBottom: '5px',
                  }}>{item.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEES */}
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800,
              letterSpacing: '-0.02em', color: 'var(--text-primary)',
            }}>
              Your trust matters to us
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="guarantee-grid">
            {GUARANTEE_POINTS.map((g, i) => (
              <div key={i} style={{
                padding: '24px 20px', borderRadius: '18px', textAlign: 'center',
                background: 'rgba(26,26,38,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{g.icon}</div>
                <div style={{
                  fontWeight: 700, fontSize: '14px',
                  color: 'var(--text-primary)', marginBottom: '8px',
                }}>{g.title}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.55 }}>
                  {g.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          padding: '48px 40px', borderRadius: '28px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(123,63,228,0.14), rgba(236,72,153,0.08))',
          border: '1px solid rgba(155,111,244,0.2)',
        }}>
          <h3 style={{
            fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800,
            letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px',
          }}>
            Not sure which plan fits?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '28px' }}>
            Start with the free demo. Our advisor will recommend the right plan for your child's age and goals.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/book-demo')}
              style={{
                padding: '14px 32px', borderRadius: '50px',
                background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
                color: '#fff', border: 'none', fontWeight: 700, fontSize: '15px',
                cursor: 'pointer', boxShadow: '0 6px 24px rgba(123,63,228,0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Book Free Demo
            </button>
            <a
              href="https://wa.me/919999999999?text=Hi%2C+I+need+help+choosing+an+UpgrAIed+plan."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '14px 32px', borderRadius: '50px',
                background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)',
                color: '#25D366', fontWeight: 700, fontSize: '15px',
                textDecoration: 'none', transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(37,211,102,0.18)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(37,211,102,0.1)'}
            >
              💬 Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <FAQSection />
      <StickyCTA />
    </div>
  );
}
