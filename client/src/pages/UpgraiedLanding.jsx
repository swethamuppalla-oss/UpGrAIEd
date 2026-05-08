import { useNavigate } from 'react-router-dom';
import './UpgraiedLanding.scss';

import { useAdminMode }   from '../hooks/useAdminMode';
import { useCMSContent }  from '../hooks/useCMSContent';

import GrowthNavbar       from '../components/growth/GrowthNavbar';
import ParentBenefits     from '../components/growth/ParentBenefits';
import TrustSection       from '../components/growth/TrustSection';
import FAQSection         from '../components/growth/FAQSection';

import Hero               from '../components/upgraied/Hero/Hero';
import BloomJourney       from '../components/upgraied/BloomJourney/BloomJourney';
import DashboardPreview   from '../components/upgraied/DashboardPreview/DashboardPreview';

const DEFAULTS = {
  hero: {
    badge:      'AI-Powered · Ages 8–14',
    title:      'The Smarter Way to Study Anything',
    subtitle:   'Upload a chapter. ROB — your AI learning buddy — builds a full week of structured lessons, quizzes, and checkpoints. No prep required.',
    image:      '',
    ctaPrimary: 'Start for Free',
    ctaGhost:   'Watch Demo',
  },
};

export default function UpgraiedLanding() {
  const navigate            = useNavigate();
  const { isAdmin, toggle } = useAdminMode();
  const { content, update } = useCMSContent('home', DEFAULTS);

  const handleCta = () => navigate('/login?role=student');

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <GrowthNavbar />

      <main className="upgraied-landing">
        {/* Admin mode toggle — visible only when ?admin=1 in URL or already admin */}
        <AdminBar isAdmin={isAdmin} onToggle={toggle} />

      <Hero
        data={content.hero}
        onUpdate={(key, value) => update('hero', key, value)}
        onCtaClick={handleCta}
      />
      
      <section className="u-products" style={{ padding: '80px 20px', background: 'var(--bg-main)', textAlign: 'center' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 className="clash-display" style={{ fontSize: 36, color: 'var(--text-primary)', marginBottom: 16 }}>Our Learning Ecosystem</h2>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>
            Choose the perfect path for your child's educational journey.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            <div className="ui-card" style={{ padding: 40, borderTop: '4px solid var(--brand-primary)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
              <h3 className="clash-display" style={{ fontSize: 24, marginBottom: 12 }}>UpGrAIEd</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                The AI-powered learning buddy. Upload chapters and let Bloom create a structured week of lessons, quizzes, and checkpoints.
              </p>
              <button className="btn-primary" onClick={handleCta}>Explore UpGrAIEd</button>
            </div>
            
            <div className="ui-card" style={{ padding: 40, borderTop: '4px solid var(--accent-orange)', position: 'relative' }}>
              <span className="badge-orange" style={{ position: 'absolute', top: 16, right: 16 }}>Coming Soon</span>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
              <h3 className="clash-display" style={{ fontSize: 24, marginBottom: 12 }}>UpGrEd with Bloom</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                A structured, traditional academic curriculum designed to master core subjects with expert-led video lessons and assignments.
              </p>
              <button className="btn-ghost" onClick={() => navigate('/upgred')}>Learn More</button>
            </div>
          </div>
        </div>
      </section>

      <BloomJourney />
      <DashboardPreview />
      
      <ParentBenefits />
      <TrustSection />
      <FAQSection />
      
      </main>
      <GrowthFooter />
    </div>
  );
}

// ── Floating admin bar ────────────────────────────────────
function AdminBar({ isAdmin, onToggle }) {
  const show = isAdmin || new URLSearchParams(window.location.search).has('admin');
  if (!show) return null;

  return (
    <div className={`admin-bar${isAdmin ? ' admin-bar--active' : ''}`}>
      <span className="admin-bar__label">
        {isAdmin ? '✏ Admin mode ON' : 'Admin mode OFF'}
      </span>
      <button className="admin-bar__btn" onClick={onToggle}>
        {isAdmin ? 'Exit editing' : 'Enable editing'}
      </button>
    </div>
  );
}

// ── Footer ───────────────────────────────────────────────
function GrowthFooter() {
  const navigate = useNavigate();
  return (
    <footer style={{
      padding: '48px 32px 100px',
      borderTop: '1px solid rgba(110,220,95,0.15)',
      background: 'var(--bg-soft)',
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
            }}>UpGrAIEd</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.65 }}>
            Premium AI learning for children aged 8–14. Building the next generation of thinkers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '16px', fontSize: '13px' }}>
              PRODUCT
            </div>
            {['Why UpGrAIEd', 'Pricing', 'Book Demo'].map((link, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <span
                  onClick={() => navigate(['/why', '/pricing', '/book-demo'][i])}
                  style={{ color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
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
              href="mailto:hello@upgraied.com"
              style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none' }}
            >
              ✉️ hello@upgraied.com
            </a>
          </div>
        </div>
      </div>
      <div style={{
        maxWidth: '1200px', margin: '32px auto 0',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '24px', textAlign: 'center',
        color: 'var(--text-muted)', fontSize: '12px',
      }}>
        © 2026 UpGrAIEd. All rights reserved. · Built for the next generation.
      </div>
    </footer>
  );
}
