import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { trackEvent, EVENTS } from '../utils/analytics';
import GrowthNavbar from '../components/growth/GrowthNavbar';
import HeroSection from '../components/growth/HeroSection';
import BloomGrid from '../components/sections/BloomGrid';
import QuickQuestions from '../components/sections/QuickQuestions';
import ParentBenefits from '../components/growth/ParentBenefits';
import TrustSection from '../components/growth/TrustSection';
import VisionCarousel from '../components/sections/VisionCarousel';
import FAQSection from '../components/growth/FAQSection';
import StickyCTA from '../components/growth/StickyCTA';

export default function LandingPage() {
  useEffect(() => {
    trackEvent(EVENTS.LANDING_VIEW);
  }, []);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Link to="/upgraied" style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
        padding: '10px 18px', borderRadius: 999,
        background: '#0A1F12', color: '#6EDC5F',
        fontSize: 13, fontWeight: 700, textDecoration: 'none',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      }}>
        Try New Version 🚀
      </Link>
      <GrowthNavbar />
      <HeroSection />
      <BloomGrid />
      <QuickQuestions />
      <ParentBenefits />
      <TrustSection />
      <VisionCarousel />
      <FAQSection />
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
      borderTop: '1px solid rgba(110,220,95,0.15)',
      background: '#F7FFF8',
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
          <p style={{ color: '#4B6B57', fontSize: '13px', lineHeight: 1.65 }}>
            Premium AI learning for children aged 8–14. Building the next generation of thinkers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#0A1F12', fontWeight: 700, marginBottom: '16px', fontSize: '13px' }}>
              PRODUCT
            </div>
            {['Why UpgrAIed', 'Pricing', 'Book Demo'].map((link, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <span
                  onClick={() => navigate(['/why', '/pricing', '/book-demo'][i])}
                  style={{ color: '#4B6B57', fontSize: '13px', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = '#0A1F12'}
                  onMouseOut={e => e.currentTarget.style.color = '#4B6B57'}
                >
                  {link}
                </span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: '#0A1F12', fontWeight: 700, marginBottom: '16px', fontSize: '13px' }}>
              CONTACT
            </div>
            <a
              href="mailto:hello@upgraied.com"
              style={{ display: 'block', color: '#4B6B57', fontSize: '13px', textDecoration: 'none' }}
            >
              ✉️ hello@upgraied.com
            </a>
          </div>
        </div>
      </div>
      <div style={{
        maxWidth: '1200px', margin: '32px auto 0',
        borderTop: '1px solid rgba(110,220,95,0.12)',
        paddingTop: '24px', textAlign: 'center',
        color: 'rgba(10,31,18,0.4)', fontSize: '12px',
      }}>
        © 2025 UpgrAIed. All rights reserved. · Built for the next generation.
      </div>
    </footer>
  );
}
