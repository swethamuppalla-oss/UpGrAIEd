import React from 'react';
import { useNavigate } from 'react-router-dom';
import GrowthNavbar from '../components/growth/GrowthNavbar';
import PricingCards from '../components/growth/PricingCards';
import FAQSection from '../components/growth/FAQSection';
import StickyCTA from '../components/growth/StickyCTA';
import BloomCharacter from '../components/Bloom/BloomCharacter';
import BloomParticles from '../components/Bloom/BloomParticles';
import '../styles/bloom.css';

const GUARANTEE_POINTS = [
  { icon: '🎁', title: 'Free Demo First',    desc: 'Try a full demo session before any payment. See Bloom in action.', accent: '#6EDC5F' },
  { icon: '🔒', title: 'Secure Payments',    desc: 'All transactions are SSL-secured and processed via Razorpay.', accent: '#63C7FF' },
  { icon: '📞', title: 'Advisor Support',    desc: 'Human advisors are available on WhatsApp for any questions.', accent: '#FFD95A' },
  { icon: '🔄', title: 'Easy Cancellation', desc: 'No lock-ins. Cancel anytime from your parent dashboard.', accent: '#FF8A65' },
];

const INCLUDED = [
  { icon: '🌿', title: 'Bloom AI Companion',  desc: 'Personality-driven buddy who adapts to your child.' },
  { icon: '📊', title: 'Parent Dashboard',    desc: 'See progress, time spent, and achievements live.' },
  { icon: '🎯', title: 'Daily Missions',      desc: 'Structured tasks that build real skills session by session.' },
  { icon: '🏆', title: 'Badges & XP',        desc: 'Gamified rewards that keep children motivated.' },
  { icon: '📱', title: 'Mobile Access',       desc: 'Learn on any device — phone, tablet, or desktop.' },
  { icon: '🔒', title: 'Safe Environment',    desc: 'Zero unfiltered AI, zero inappropriate content.' },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0A1F12', minHeight: '100vh' }}>
      <GrowthNavbar />
      <BloomParticles count={12} zIndex={0} />

      {/* HERO */}
      <section className="pg-section" style={{ paddingTop: 130, textAlign: 'center', position: 'relative' }}>
        <div className="pg-orb" style={{ top: 0, left: '25%', width: 700, height: 380, background: 'radial-gradient(ellipse, rgba(110,220,95,0.10), transparent 70%)', filter: 'blur(70px)' }} />
        <div className="pg-orb" style={{ top: '20%', right: '-5%', width: 360, height: 360, background: 'radial-gradient(circle, rgba(99,199,255,0.07), transparent 70%)', filter: 'blur(50px)', animationDuration: '22s' }} />

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <BloomCharacter size="medium" emotion="encouraging" speech="There's a plan for every family!" animate style={{ marginBottom: 20 }} />
          <div className="pg-badge pg-badge-warm">SIMPLE, TRANSPARENT PRICING</div>
          <h1 className="pg-h1" style={{ marginBottom: 18 }}>
            Invest in your child's{' '}
            <span className="bloom-text-green">future skills</span>
          </h1>
          <p className="pg-sub">
            No hidden fees. No pressure. Start with a free demo and upgrade when you're ready.
          </p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="pg-section" style={{ paddingTop: 24 }}>
        <div className="pg-container">
          <PricingCards />
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="pg-section pg-section-alt">
        <div className="pg-orb" style={{ bottom: '-5%', left: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,199,255,0.06), transparent 70%)', filter: 'blur(50px)', animationDuration: '25s' }} />
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="pg-badge">EVERY PLAN INCLUDES</div>
            <h2 className="pg-h2">Built to delight students <span className="bloom-text-sky">and</span> reassure parents</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="pg-grid-3">
            {INCLUDED.map((item, i) => (
              <div key={i} className="pg-card" style={{ display: 'flex', gap: 14, padding: 22 }}>
                <div className="pg-icon" style={{ width: 44, height: 44, fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#F0FFF4', marginBottom: 5 }}>{item.title}</div>
                  <div style={{ color: 'rgba(168,245,162,0.65)', fontSize: 13, lineHeight: 1.55 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEES */}
      <section className="pg-section" style={{ background: '#0D2318' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 56, alignItems: 'center', marginBottom: 56 }}>
            <BloomCharacter size="medium" emotion="happy" speech="Your trust matters to us!" animate />
            <div>
              <div className="pg-badge">OUR PROMISE</div>
              <h2 className="pg-h2">Your trust matters to us</h2>
              <p className="pg-sub">Every plan comes with guarantees that put families first.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="pg-grid-4">
            {GUARANTEE_POINTS.map((g, i) => (
              <div key={i} className="pg-card" style={{ padding: '28px 20px', textAlign: 'center' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', margin: '0 auto 14px',
                  background: `${g.accent}14`, border: `1px solid ${g.accent}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                }}>{g.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#F0FFF4', marginBottom: 8 }}>{g.title}</div>
                <div style={{ color: 'rgba(168,245,162,0.62)', fontSize: 13, lineHeight: 1.55 }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="pg-section" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="bloom-hero-card" style={{ padding: '48px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(110,220,95,0.15), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,199,255,0.10), transparent)', pointerEvents: 'none' }} />
            <h3 className="pg-h3" style={{ marginBottom: 12 }}>Not sure which plan fits?</h3>
            <p className="pg-sub" style={{ marginBottom: 28 }}>
              Start with the free demo. Our advisor will recommend the right plan for your child's age and goals.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="bloom-btn-primary" style={{ fontSize: 15, padding: '14px 32px' }} onClick={() => navigate('/book-demo')}>
                Book Free Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
      <StickyCTA />
    </div>
  );
}
