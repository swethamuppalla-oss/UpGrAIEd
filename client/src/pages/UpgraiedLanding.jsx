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
