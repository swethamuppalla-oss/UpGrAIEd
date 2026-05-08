import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F4F1',
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <header style={{
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#F5F4F1',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 2px 10px rgba(110,220,95,0.3)',
          }}>🌿</div>
          <span style={{
            fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #2A7A20, #6EDC5F)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>UpGrAIEd</span>
        </div>
        <button
          onClick={() => nav('/login')}
          style={{
            padding: '9px 22px', borderRadius: 22,
            background: '#0A1F12', color: '#fff',
            border: 'none', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.01em',
          }}
        >
          Login
        </button>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, padding: '60px 24px 80px', maxWidth: 700, margin: '0 auto', width: '100%' }}>
        <p style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#8A8A8A', marginBottom: 12,
        }}>
          LEARNING · ECOSYSTEM
        </p>
        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 800,
          color: '#0A1F12', lineHeight: 1.15,
          letterSpacing: '-0.02em', marginBottom: 12,
        }}>
          Choose your{' '}
          <em style={{ fontStyle: 'italic', color: '#3DAA3A' }}>learning path</em>
        </h1>
        <p style={{ fontSize: 17, color: '#5A6B62', marginBottom: 48, lineHeight: 1.6 }}>
          Two powerful products. One mission — to make every student a builder.
        </p>

        {/* Product cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* UpGrAIEd card — gradient feature card */}
          <div
            onClick={() => nav('/upgraied')}
            style={{
              borderRadius: 24,
              background: 'linear-gradient(135deg, #1A3D2B 0%, #0F5132 100%)',
              padding: '32px 28px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(10,31,18,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Orb decorations */}
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 160, height: 160, borderRadius: '50%',
              background: 'rgba(110,220,95,0.12)',
            }} />
            <div style={{
              position: 'absolute', bottom: -30, right: 80,
              width: 100, height: 100, borderRadius: '50%',
              background: 'rgba(110,220,95,0.08)',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: 'rgba(110,220,95,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                  border: '1px solid rgba(110,220,95,0.3)',
                }}>🤖</div>
                <span style={{
                  padding: '5px 12px', borderRadius: 20,
                  background: 'rgba(110,220,95,0.15)',
                  border: '1px solid rgba(110,220,95,0.25)',
                  color: '#6EDC5F', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                }}>AI-POWERED</span>
              </div>

              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.01em' }}>
                UpGrAIEd <span style={{ color: '#6EDC5F' }}>with Bloom</span>
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, marginBottom: 24, maxWidth: 380 }}>
                Upload any chapter — Bloom builds a full week of personalised lessons, quizzes, and checkpoints. Grades 5–12.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 20 }}>
                  {[['1,200+', 'Learners'], ['94%', 'Comprehension'], ['7 Days', 'Per chapter']].map(([n, l]) => (
                    <div key={l}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{n}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
                <button style={{
                  padding: '10px 20px', borderRadius: 20,
                  background: '#6EDC5F', color: '#0A1F12',
                  border: 'none', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  Explore →
                </button>
              </div>
            </div>
          </div>

          {/* UpGrEd card — soft neutral card */}
          <div
            onClick={() => nav('/upgred')}
            style={{
              borderRadius: 24,
              background: '#fff',
              padding: '28px',
              cursor: 'pointer',
              border: '1px solid #E8E8E4',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}>📚</div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0A1F12', marginBottom: 3 }}>
                    UpGrEd <span style={{ color: '#F59E0B' }}>with Bloom</span>
                  </h3>
                  <p style={{ fontSize: 12, color: '#8A8A8A' }}>School Curriculum · Structured Learning</p>
                </div>
              </div>
              <span style={{
                padding: '4px 10px', borderRadius: 20,
                background: '#FFF3E0', color: '#D97706',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap',
              }}>COMING SOON</span>
            </div>
            <p style={{ fontSize: 14, color: '#5A6B62', lineHeight: 1.65, marginBottom: 0 }}>
              A structured school curriculum with expert-led video lessons, step-by-step guidance, and real assignments for grades 5–12.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', color: '#A0A0A0', fontSize: 12, marginTop: 40 }}>
          © 2026 UpGrAIEd · Built for the next generation of builders.
        </p>
      </main>
    </div>
  );
}
