import { useNavigate } from 'react-router-dom';
import './UpgraiedLanding.scss';

import { useAdminMode }   from '../hooks/useAdminMode';
import { useCMSContent }  from '../hooks/useCMSContent';
import Hero               from '../components/upgraied/Hero/Hero';
import LearningFlow       from '../components/upgraied/LearningFlow/LearningFlow';
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
              <h3 className="clash-display" style={{ fontSize: 24, marginBottom: 12 }}>UpGrEd</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                A structured, traditional academic curriculum designed to master core subjects with expert-led video lessons and assignments.
              </p>
              <button className="btn-ghost" disabled>Learn More</button>
            </div>
          </div>
        </div>
      </section>

      <LearningFlow onCtaClick={handleCta} />
      <BloomJourney />
      <DashboardPreview />
    </main>
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
