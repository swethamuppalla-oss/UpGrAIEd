import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import GrowthNavbar from '../components/growth/GrowthNavbar';

/* ─── static data (from technical document) ──────────────────── */
const PROCESS_STEPS = [
  {
    num: '01', icon: '📱',
    title: 'Join with OTP',
    sub: 'Instant secure access using your Indian mobile number. No passwords.',
  },
  {
    num: '02', icon: '🎬',
    title: 'Pick your track',
    sub: 'AI selects the best video module sequence for your grade and chapter.',
  },
  {
    num: '03', icon: '🧠',
    title: 'Watch & learn with Bloom',
    sub: 'Expert-led, DRM-protected video lessons — clear, 4G-optimised, and watermarked.',
  },
  {
    num: '04', icon: '✅',
    title: 'Quiz with real AI feedback',
    sub: 'Adaptive questions that get smarter as you progress.',
  },
  {
    num: '05', icon: '⭐',
    title: 'Earn XP & level up',
    sub: 'Streaks, badges, and milestones — all visible to parents in real time.',
  },
];

const PLATFORM_FEATURES = [
  {
    icon: '🎬',
    title: 'Expert Video Lessons',
    desc: 'HD video modules streamed securely via Bunny.net with DRM protection, visible watermarking, and 4G-optimised delivery. No downloads.',
  },
  {
    icon: '🤖',
    title: 'Bloom AI Companion',
    desc: 'Bloom personalises your learning path, quizzes you adaptively, and tracks your mastery — chapter by chapter.',
  },
  {
    icon: '📊',
    title: 'Parent Dashboard',
    desc: 'Real-time visibility into videos watched, quiz scores, daily streaks, and the first XP milestone your child earns.',
  },
  {
    icon: '🔒',
    title: 'Safe & Secure',
    desc: 'OTP-only login, single active session, non-downloadable videos. Your child\'s account, fully protected.',
  },
  {
    icon: '💳',
    title: 'Hassle-Free Payments',
    desc: 'Pay via UPI, credit/debit card, or net banking. Auto-GST invoice (18%, SAC 999294) emailed after every payment.',
  },
  {
    icon: '🏫',
    title: 'School Integration',
    desc: 'Schools can enrol students at scale and track class-level and individual performance. (Phase 2)',
  },
];

const WHO_FOR = [
  {
    emoji: '👧',
    role: 'Students',
    tagline: 'Grades 5–12',
    points: [
      'Watch expert video lessons at your own pace',
      'Quiz with Bloom and get instant AI feedback',
      'Earn XP, badges, and level-up streaks',
      'Access from any device, anywhere',
    ],
    accent: '#6EDC5F',
    bg: 'rgba(110,220,95,0.06)',
    border: 'rgba(110,220,95,0.2)',
  },
  {
    emoji: '👩',
    role: 'Parents',
    tagline: 'Full visibility',
    points: [
      'Track videos watched and chapters completed',
      'See daily streaks and quiz performance',
      'Download auto-generated GST invoices',
      'Monitor your child\'s first XP milestones',
    ],
    accent: '#60A5FA',
    bg: 'rgba(96,165,250,0.06)',
    border: 'rgba(96,165,250,0.2)',
  },
  {
    emoji: '🏫',
    role: 'Schools',
    tagline: 'Phase 2',
    points: [
      'Enrol entire classes in one click',
      'Track class-level and individual performance',
      'City-wise geographic learner breakdown',
      'Institutional pricing available',
    ],
    accent: '#A78BFA',
    bg: 'rgba(167,139,250,0.06)',
    border: 'rgba(167,139,250,0.2)',
  },
];

const STATS = [
  { n: '1,200+', l: 'Active Learners' },
  { n: '94%',    l: 'Avg. Comprehension' },
  { n: '50k+',   l: 'Lessons Completed' },
  { n: '4.9 ★',  l: 'Parent Rating' },
];

/* ─── component ───────────────────────────────────────────────── */
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
            HERO CARD — deep green gradient
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
                  AI-POWERED · GRADES 5–12 · VIDEO-FIRST
                </span>

                <h1 style={{
                  fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800,
                  color: '#fff', lineHeight: 1.15,
                  letterSpacing: '-0.02em', marginBottom: 16,
                }}>
                  UpGrAIEd{' '}
                  <em style={{ fontStyle: 'italic', color: '#6EDC5F' }}>with Bloom</em>
                </h1>

                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 12, maxWidth: 420 }}>
                  Expert video lessons, an AI companion, and real-time progress tracking — all in one platform built for Indian students, grades 5 to 12.
                </p>
                <p style={{ fontSize: 14, color: 'rgba(110,220,95,0.75)', marginBottom: 32, maxWidth: 420, lineHeight: 1.6 }}>
                  Secure OTP login · DRM-protected videos · Auto-GST invoices · Parent dashboard
                </p>

                <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  <button
                    onClick={handleCta}
                    style={{
                      padding: '13px 28px', borderRadius: 22,
                      background: '#6EDC5F', color: '#0A1F12',
                      border: 'none', fontSize: 15, fontWeight: 700,
                      cursor: 'pointer', letterSpacing: '0.01em',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(110,220,95,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
                  >
                    Get Started Free →
                  </button>
                  <button
                    onClick={() => navigate('/upgred')}
                    style={{
                      padding: '13px 28px', borderRadius: 22,
                      background: 'transparent', color: 'rgba(255,255,255,0.75)',
                      border: '1px solid rgba(255,255,255,0.2)', fontSize: 15, fontWeight: 600,
                      cursor: 'pointer', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'}
                  >
                    See UpGrEd →
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
            THE PROCESS — Five steps
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 20px 0' }}>
          <div style={{
            maxWidth: 900, margin: '0 auto',
            background: '#fff', borderRadius: 24,
            padding: 'clamp(28px, 4vw, 44px)',
            border: '1px solid #E8E8E4',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#F0FFF4', border: '1px solid rgba(110,220,95,0.3)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
              }}>⚡</div>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:'#8A8A8A', letterSpacing:'0.08em', textTransform:'uppercase', margin:0 }}>THE PROCESS</p>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#0A1F12', margin:0, letterSpacing:'-0.01em' }}>
                  Five steps from enrolment to mastery
                </h2>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:14 }}>
              {PROCESS_STEPS.map((step, i) => (
                <div key={i} style={{
                  padding: '20px 18px',
                  background: i === 0
                    ? 'linear-gradient(135deg, #1A3D2B, #0F5132)'
                    : '#F9F9F7',
                  borderRadius: 16,
                  border: i === 0 ? 'none' : '1px solid #EBEBEB',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(110,220,95,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
                >
                  <div style={{ fontSize:22, marginBottom:12 }}>{step.icon}</div>
                  <div style={{
                    fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
                    color: i === 0 ? 'rgba(110,220,95,0.8)' : '#BDBDBD',
                    marginBottom: 8,
                  }}>{step.num}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? '#fff' : '#0A1F12', marginBottom: 6 }}>
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
            PLATFORM FEATURES
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 20px 0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#8A8A8A', letterSpacing:'0.08em', textTransform:'uppercase', margin:'0 0 6px' }}>PLATFORM</p>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#0A1F12', margin:0, letterSpacing:'-0.01em' }}>
                Built for Indian learners, from the ground up
              </h2>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:12 }}>
              {PLATFORM_FEATURES.map((f, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 18,
                  padding: '22px', border: '1px solid #E8E8E4',
                  display:'flex', gap:14, alignItems:'flex-start',
                  transition: 'box-shadow 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.06)'; e.currentTarget.style.transform='translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}
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
            WHO IS IT FOR
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 20px 0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#8A8A8A', letterSpacing:'0.08em', textTransform:'uppercase', margin:'0 0 6px' }}>WHO IT'S FOR</p>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#0A1F12', margin:0, letterSpacing:'-0.01em' }}>
                Designed for every part of the learning journey
              </h2>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:14 }}>
              {WHO_FOR.map((w, i) => (
                <div key={i} style={{
                  background: w.bg,
                  border: `1px solid ${w.border}`,
                  borderRadius: 20, padding: '26px 22px',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${w.accent}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
                >
                  <div style={{ fontSize:32, marginBottom:10 }}>{w.emoji}</div>
                  <div style={{ fontSize:16, fontWeight:800, color:'#0A1F12', marginBottom:2 }}>{w.role}</div>
                  <div style={{ fontSize:11, fontWeight:700, color: w.accent, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:16 }}>{w.tagline}</div>
                  <ul style={{ margin:0, padding:0, listStyle:'none' }}>
                    {w.points.map((p, j) => (
                      <li key={j} style={{ fontSize:13, color:'#5A6B62', lineHeight:1.6, marginBottom:8, display:'flex', gap:8, alignItems:'flex-start' }}>
                        <span style={{ color: w.accent, fontWeight:700, flexShrink:0, marginTop:1 }}>✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            CTA BANNER
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
                Ready to start learning with Bloom?
              </h2>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.75)', margin:0 }}>
                Join 1,200+ students already learning on UpGrAIEd. Free to get started.
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
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}
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
              AI-powered video learning for students aged 10–18. Expert lessons, Bloom companion, parent visibility.
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
