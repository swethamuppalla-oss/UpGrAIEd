import { useNavigate } from 'react-router-dom';
import BloomCharacter from '../components/Bloom/BloomCharacter';

const PRODUCTS = [
  {
    id: 'ai',
    route: '/upgr-ai',
    label: 'UpGrAIEd',
    tagline: 'AI Tutor with Bloom',
    desc: 'Personalized AI tutoring that adapts to how you learn. Ask anything, understand everything.',
    cta: 'Start Tutoring',
    accent: '#7B3FE4',
    textOnAccent: '#fff',
    heroBg: 'linear-gradient(145deg, #F5F0FF, #EDE8FF)',
    border: 'rgba(123,63,228,0.18)',
    emotion: 'excited',
    speech: "Let's learn!",
  },
  {
    id: 'ed',
    route: '/upgr-ed',
    label: 'UpGrEd',
    tagline: 'Structured Learning System',
    desc: 'A full curriculum with progress tracking, practice challenges, and Bloom as your guide.',
    cta: 'Open Dashboard',
    accent: '#6EDC5F',
    textOnAccent: '#0A1F12',
    heroBg: 'linear-gradient(145deg, #EDFFF3, #E0FFE8)',
    border: 'rgba(110,220,95,0.2)',
    emotion: 'teaching',
    speech: 'Ready to grow?',
  },
];

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: '#FFFFFF',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '72px 24px 80px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h1 style={{ fontSize: 38, fontWeight: 800, color: '#0A1F12', margin: '0 0 10px' }}>
          UpgrAIed
        </h1>
        <p style={{ fontSize: 16, color: '#4B6B57', margin: 0 }}>
          Choose your learning experience
        </p>
      </div>

      {/* Product cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24, maxWidth: 780, width: '100%',
      }}>
        {PRODUCTS.map(p => (
          <div
            key={p.id}
            onClick={() => nav(p.route)}
            style={{
              border: `1.5px solid ${p.border}`, borderRadius: 22,
              overflow: 'hidden', cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              background: '#FFFFFF',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = `0 12px 40px ${p.accent}28`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Bloom area */}
            <div style={{
              background: p.heroBg, padding: '36px 24px 28px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <BloomCharacter emotion={p.emotion} size="medium" speech={p.speech} animate />
            </div>

            {/* Text area */}
            <div style={{ padding: '24px 24px 28px' }}>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                padding: '3px 10px', borderRadius: 20,
                background: p.accent + '18', color: p.accent,
              }}>
                {p.label}
              </span>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0A1F12', margin: '12px 0 8px' }}>
                {p.tagline}
              </h2>
              <p style={{ fontSize: 14, color: '#4B6B57', margin: '0 0 24px', lineHeight: 1.65 }}>
                {p.desc}
              </p>
              <button
                style={{
                  background: p.accent, color: p.textOnAccent,
                  border: 'none', padding: '10px 24px', borderRadius: 24,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%',
                }}
              >
                {p.cta} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
