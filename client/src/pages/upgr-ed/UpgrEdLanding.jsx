import { useNavigate } from 'react-router-dom';
import GrowthNavbar from '../../components/growth/GrowthNavbar';
import LearningFlow from '../../components/upgraied/LearningFlow/LearningFlow';

export default function UpgrEdLanding() {
  const nav = useNavigate();
  const handleCta = () => nav('/login?role=student');

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <GrowthNavbar />

      <main style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
          <span style={{
            display: 'inline-block', padding: '8px 20px', borderRadius: 24,
            background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-green)',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.04em',
            marginBottom: 24, border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            School Curriculum
          </span>
          <h1 className="clash-display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', color: 'var(--text-primary)', marginBottom: 24 }}>
            UpGrEd <em style={{ fontStyle: 'normal', color: 'var(--brand-primary)' }}>with Bloom</em>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
            A structured, traditional academic curriculum designed to master core subjects with expert-led video lessons, step-by-step guidance, and real-world assignments.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={handleCta} style={{ padding: '14px 28px', fontSize: 16 }}>
              Get Started for Free
            </button>
            <button className="btn-ghost" onClick={() => nav('/')} style={{ padding: '14px 28px', fontSize: 16 }}>
              Explore UpGrAIEd
            </button>
          </div>
        </div>
      </main>

      <LearningFlow onCtaClick={handleCta} />

      <GrowthFooter />
    </div>
  );
}

function GrowthFooter() {
  const navigate = useNavigate();
  return (
    <footer style={{
      padding: '48px 32px 100px',
      borderTop: '1px solid var(--border-color)',
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
            }}>UpGrEd</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.65 }}>
            Master your school curriculum with the power of structured AI learning.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '16px', fontSize: '13px' }}>
              PRODUCT
            </div>
            {['Home', 'UpGrAIEd'].map((link, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <span
                  onClick={() => navigate(i === 0 ? '/upgred' : '/')}
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
