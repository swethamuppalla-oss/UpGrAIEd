import { useNavigate } from 'react-router-dom';
import BloomCharacter from '../../components/Bloom/BloomCharacter';
import ProductLayout from '../../components/layout/ProductLayout';

const FEATURES = [
  { icon: '✨', title: 'Adaptive AI', desc: 'Lessons that adjust to your pace and learning style automatically.' },
  { icon: '💬', title: 'Conversational', desc: 'Ask anything in plain language and get clear, patient answers.' },
  { icon: '🎯', title: 'Goal-Focused', desc: 'Track real progress toward concepts that actually matter.' },
];

export default function LandingAI() {
  const nav = useNavigate();

  return (
    <ProductLayout product="ai">
      {/* Hero */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '80px 24px 64px',
        background: 'linear-gradient(160deg, #F5F0FF 0%, #FFFFFF 55%)',
      }}>
        <BloomCharacter emotion="excited" size="hero" speech="Let's learn together! 🚀" animate />

        <div style={{ marginTop: 40, maxWidth: 560 }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.15, margin: '0 0 16px', color: '#0A1F12' }}>
            Your Personal<br />
            <span style={{ color: '#7B3FE4' }}>AI Tutor</span>
          </h1>
          <p style={{ fontSize: 18, color: '#4B6B57', lineHeight: 1.6, margin: '0 0 40px' }}>
            Bloom learns how you think and meets you where you are.
            Ask questions, get clear explanations, and actually understand.
          </p>
          <button
            onClick={() => nav('/upgr-ai/chat')}
            style={{
              background: '#7B3FE4', color: '#fff', border: 'none',
              padding: '14px 36px', borderRadius: 32, fontSize: 16, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(123,63,228,0.3)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Start Tutoring →
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '64px 24px', maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#0A1F12', margin: '0 0 36px' }}>
          Why UpGrAIEd works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              padding: '28px 24px', borderRadius: 16,
              border: '1px solid rgba(123,63,228,0.12)',
              background: '#FAFAFA',
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: '#0A1F12' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#4B6B57', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </ProductLayout>
  );
}
