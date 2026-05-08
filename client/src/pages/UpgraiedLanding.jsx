import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GrowthNavbar from '../components/growth/GrowthNavbar';
import { useConfig } from '../context/ConfigContext';

/* ─── tiny hook ─────────────────────────────── */
function useScrolled(threshold = 40) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > threshold);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, [threshold]);
  return s;
}

/* ─── static data ────────────────────────────── */
const FEATURES = [
  { icon: '📄', title: 'Upload Any Chapter', desc: 'PDF, photo, or text. Bloom ingests it instantly.' },
  { icon: '🤖', title: 'AI Builds the Plan', desc: 'A full 7-day micro-lesson plan, automatically structured.' },
  { icon: '🧠', title: 'Learn at Your Pace', desc: 'Bite-sized daily lessons that fit into any schedule.' },
  { icon: '✅', title: 'Adaptive Quizzes', desc: 'Questions that test real understanding, not just recall.' },
  { icon: '⭐', title: 'XP & Badges', desc: 'Gamified rewards that keep students motivated.' },
  { icon: '📊', title: 'Parent Dashboard', desc: 'Real-time progress tracking for every chapter.' },
];

const HOW_STEPS = [
  { num: '01', title: 'Upload a chapter', sub: 'Any subject. Any format.' },
  { num: '02', title: 'Bloom builds your plan', sub: '7 structured micro-lessons.' },
  { num: '03', title: 'Learn daily', sub: '15 minutes a day is all it takes.' },
  { num: '04', title: 'Quiz & master', sub: 'Adaptive questions + XP rewards.' },
];

const STATS = [
  { n: '1,200+', l: 'Active Learners' },
  { n: '94%',    l: 'Avg. Comprehension' },
  { n: '50k+',   l: 'Lessons Completed' },
  { n: '4.9 ★',  l: 'Parent Rating' },
];

/* ─── component ──────────────────────────────── */
export default function UpgraiedLanding() {
  const navigate  = useNavigate();
  const config    = useConfig();
  const bloomImg  = config?.ui?.mascot;

  const handleCta = () => navigate('/login');

  return (
    <div style={{ background: '#F5F4F1', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <GrowthNavbar />

      <main style={{ paddingTop: 80 }}>

        {/* ════════════════════════════════════════
            HERO CARD — dark gradient
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 20px 0' }}>
          <div style={{
            maxWidth: 900, margin: '0 auto',
            borderRadius: 28,
            background: 'linear-gradient(135deg, #1A3D2B 0%, #0F5132 60%, #092E1E 100%)',
            padding: 'clamp(32px, 5vw, 56px)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative orbs */}
            <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(110,220,95,0.1)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:-40, right:120, width:140, height:140, borderRadius:'50%', background:'rgba(110,220,95,0.07)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', top:80, right:32, width:80, height:80, borderRadius:'50%', background:'rgba(110,220,95,0.05)', pointerEvents:'none' }} />

            <div style={{ position:'relative', zIndex:1, display:'flex', gap:40, alignItems:'center', flexWrap:'wrap' }}>
              {/* Left copy */}
              <div style={{ flex:'1 1 320px' }}>
                <span style={{
                  display: 'inline-block', padding: '5px 14px', borderRadius: 20,
                  background: 'rgba(110,220,95,0.15)', border: '1px solid rgba(110,220,95,0.3)',
                  color: '#6EDC5F', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                  marginBottom: 20,
                }}>
                  AI-POWERED · GRADES 5–12
                </span>

                <h1 style={{
                  fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800,
                  color: '#fff', lineHeight: 1.15,
                  letterSpacing: '-0.02em', marginBottom: 16,
                }}>
                  The smarter way<br />
                  to <em style={{ fontStyle:'italic', color:'#6EDC5F' }}>master</em> any chapter
                </h1>

                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 32, maxWidth: 380 }}>
                  Upload a chapter. Bloom — your AI learning buddy — builds a full week of structured lessons, quizzes, and checkpoints. No prep required.
                </p>

                <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  <button
                    onClick={handleCta}
                    style={{
                      padding: '13px 28px', borderRadius: 22,
                      background: '#6EDC5F', color: '#0A1F12',
                      border: 'none', fontSize: 15, fontWeight: 700,
                      cursor: 'pointer', letterSpacing: '0.01em',
                    }}
                  >
                    Start for Free →
                  </button>
                  <button
                    onClick={() => navigate('/upgred')}
                    style={{
                      padding: '13px 28px', borderRadius: 22,
                      background: 'transparent', color: 'rgba(255,255,255,0.75)',
                      border: '1px solid rgba(255,255,255,0.2)', fontSize: 15, fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    See UpGrEd
                  </button>
                </div>

                {/* Stats row */}
                <div style={{ display:'flex', gap:24, marginTop:36, flexWrap:'wrap' }}>
                  {STATS.map(s => (
                    <div key={s.l}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.n}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2, textTransform:'uppercase', letterSpacing:'0.04em' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Bloom or placeholder */}
              {bloomImg ? (
                <div style={{ flex:'0 0 200px', textAlign:'center' }}>
                  <img
                    src={bloomImg}
                    alt="Bloom"
                    style={{ width: 180, height: 180, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(110,220,95,0.35))' }}
                  />
                </div>
              ) : (
                <div style={{
                  flex:'0 0 180px', height:180, borderRadius:24,
                  background:'rgba(110,220,95,0.08)', border:'1px dashed rgba(110,220,95,0.25)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexDirection:'column', gap:8,
                }}>
                  <span style={{ fontSize:40 }}>🌿</span>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textAlign:'center', padding:'0 12px' }}>
                    Bloom image<br />set via Admin
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            HOW IT WORKS — clean white card
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 20px 0' }}>
          <div style={{
            maxWidth: 900, margin: '0 auto',
            background: '#fff', borderRadius: 24,
            padding: 'clamp(28px, 4vw, 44px)',
            border: '1px solid #E8E8E4',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#F0FFF4', border: '1px solid rgba(110,220,95,0.3)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
              }}>⚡</div>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:'#8A8A8A', letterSpacing:'0.08em', textTransform:'uppercase', margin:0 }}>THE PROCESS</p>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#0A1F12', margin:0, letterSpacing:'-0.01em' }}>
                  Four steps from chapter to mastery
                </h2>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:16 }}>
              {HOW_STEPS.map((step, i) => (
                <div key={i} style={{
                  padding: '20px',
                  background: i === 0 ? 'linear-gradient(135deg, #1A3D2B, #0F5132)' : '#F9F9F7',
                  borderRadius: 16,
                  border: i === 0 ? 'none' : '1px solid #EBEBEB',
                }}>
                  <div style={{
                    fontSize: 12, fontWeight: 800, letterSpacing: '0.06em',
                    color: i === 0 ? 'rgba(110,220,95,0.8)' : '#BDBDBD',
                    marginBottom: 10,
                  }}>{step.num}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: i === 0 ? '#fff' : '#0A1F12', marginBottom: 4 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 12, color: i === 0 ? 'rgba(255,255,255,0.55)' : '#8A8A8A', lineHeight: 1.5 }}>
                    {step.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FEATURES — 2-col grid cards
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 20px 0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#8A8A8A', letterSpacing:'0.08em', textTransform:'uppercase', margin:'0 0 6px' }}>FEATURES</p>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#0A1F12', margin:0, letterSpacing:'-0.01em' }}>
                Everything a student needs to succeed
              </h2>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:12 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 18,
                  padding: '22px', border: '1px solid #E8E8E4',
                  display:'flex', gap:14, alignItems:'flex-start',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: '#F5F4F1', border: '1px solid #EBEBEB',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize: 20, flexShrink: 0,
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#0A1F12', marginBottom:4 }}>{f.title}</div>
                    <div style={{ fontSize:13, color:'#7A8A82', lineHeight:1.55 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            CTA BANNER — teal/green gradient
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 20px 60px' }}>
          <div style={{
            maxWidth: 900, margin: '0 auto',
            borderRadius: 24,
            background: 'linear-gradient(135deg, #4ECDC4 0%, #3DAA3A 100%)',
            padding: '40px 36px',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:20,
          }}>
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#fff', margin:'0 0 8px', letterSpacing:'-0.01em' }}>
                Ready to try it with a real chapter?
              </h2>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.75)', margin:0 }}>
                Takes less than 60 seconds to upload and get started. Free forever for one chapter.
              </p>
            </div>
            <button
              onClick={handleCta}
              style={{
                padding: '13px 28px', borderRadius: 22,
                background: '#fff', color: '#0A1F12',
                border: 'none', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', whiteSpace:'nowrap',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}
            >
              Get Started Free →
            </button>
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────── */}
      <footer style={{
        padding: '36px 24px 48px',
        borderTop: '1px solid #E8E8E4',
        background: '#fff',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display:'flex', justifyContent:'space-between',
          alignItems:'flex-start', flexWrap:'wrap', gap:24,
        }}>
          <div style={{ maxWidth:240 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <div style={{
                width:28, height:28, borderRadius:8,
                background:'linear-gradient(135deg,#6EDC5F,#3DAA3A)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:15,
              }}>🌿</div>
              <span style={{ fontSize:17, fontWeight:800, color:'#0A1F12', letterSpacing:'-0.01em' }}>UpGrAIEd</span>
            </div>
            <p style={{ fontSize:12, color:'#8A8A8A', lineHeight:1.65, margin:0 }}>
              Premium AI learning for children aged 8–14. Building the next generation of thinkers.
            </p>
          </div>
          <div style={{ display:'flex', gap:40, flexWrap:'wrap' }}>
            {[
              { heading:'Product', links:[['Home','/'],['UpGrAIEd','/upgraied'],['UpGrEd','/upgred'],['Pricing','/pricing']] },
              { heading:'Company', links:[['Book Demo','/book-demo']] },
            ].map(col => (
              <div key={col.heading}>
                <div style={{ fontSize:11, fontWeight:700, color:'#BDBDBD', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:14 }}>{col.heading}</div>
                {col.links.map(([label, path]) => (
                  <div key={label} style={{ marginBottom:10 }}>
                    <span
                      onClick={() => navigate(path)}
                      style={{ fontSize:13, color:'#5A6B62', cursor:'pointer', transition:'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color='#0A1F12'}
                      onMouseLeave={e => e.currentTarget.style.color='#5A6B62'}
                    >{label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth:900, margin:'24px auto 0', borderTop:'1px solid #EBEBEB', paddingTop:20, textAlign:'center', fontSize:11, color:'#BDBDBD' }}>
          © 2026 UpGrAIEd · All rights reserved · Built for the next generation.
        </div>
      </footer>
    </div>
  );
}
