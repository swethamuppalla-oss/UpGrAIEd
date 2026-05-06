import { useNavigate } from 'react-router-dom';
import BloomCharacter from '../../components/Bloom/BloomCharacter';
import ProductLayout from '../../components/layout/ProductLayout';

const FEATURES = [
  { icon: '📚', title: 'Structured Curriculum', desc: '6 progressive modules designed to build real understanding.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Know exactly where you stand — by module, by skill, by day.' },
  { icon: '⚡', title: 'Practice Challenges', desc: 'Test your knowledge after every lesson with instant feedback.' },
];

export default function LandingED() {
  const nav = useNavigate();

  return (
    <ProductLayout product="ed">
      {/* Hero */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '80px 24px 64px',
        background: 'linear-gradient(160deg, #EDFFF3 0%, #FFFFFF 55%)',
      }}>
        <BloomCharacter emotion="teaching" size="hero" speech="Ready to level up? 🎓" animate />

        <div style={{ marginTop: 40, maxWidth: 560 }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.15, margin: '0 0 16px', color: '#0A1F12' }}>
            Learn. Practice.<br />
            <span style={{ color: '#22A84B' }}>Grow.</span>
          </h1>
          <p style={{ fontSize: 18, color: '#4B6B57', lineHeight: 1.6, margin: '0 0 40px' }}>
            A structured learning system with Bloom as your guide.
            Master real skills with a curriculum built for the AI age.
          </p>
          <button
            onClick={() => nav('/upgr-ed/dashboard')}
            style={{
              background: '#6EDC5F', color: '#0A1F12', border: 'none',
              padding: '14px 36px', borderRadius: 32, fontSize: 16, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(110,220,95,0.35)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Open Dashboard →
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '64px 24px', maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#0A1F12', margin: '0 0 36px' }}>
          Why UpGrEd works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              padding: '28px 24px', borderRadius: 16,
              border: '1px solid rgba(110,220,95,0.15)',
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
