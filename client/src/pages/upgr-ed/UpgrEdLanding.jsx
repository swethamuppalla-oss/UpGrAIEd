import { useNavigate } from 'react-router-dom';
import BrandTopBar from '../../components/brand/BrandTopBar';

/* ─── static data ─────────────────────────────────────────────── */
const PROCESS_STEPS = [
  {
    num: '01', icon: '📄',
    title: 'Upload your chapter',
    sub: 'PDF, photo, or typed text — any subject, any format.',
    color: '#1A3365',
  },
  {
    num: '02', icon: '📚',
    title: 'Bloom builds your plan',
    sub: 'A structured 7-day micro-lesson curriculum, automatically.',
    color: null,
  },
  {
    num: '03', icon: '🧠',
    title: 'Learn step by step',
    sub: '15-minute daily lessons that actually stick.',
    color: null,
  },
  {
    num: '04', icon: '✅',
    title: 'Quiz & reach mastery',
    sub: 'Adaptive questions + progress tracked for parents.',
    color: null,
  },
];

const FEATURES = [
  { icon: '📄', title: 'Any Chapter, Any Subject',   desc: 'Upload PDFs, photos, or text from any textbook. Bloom handles the rest.' },
  { icon: '🤖', title: 'AI Lesson Planning',          desc: 'Bloom auto-generates a 7-day structured micro-lesson plan in seconds.' },
  { icon: '🧠', title: 'Bite-Sized Daily Lessons',    desc: '15 minutes a day. Concepts explained clearly, step by step.' },
  { icon: '✅', title: 'Adaptive Quiz Engine',         desc: 'Questions that test real understanding — not just memory.' },
  { icon: '📊', title: 'Parent Progress Dashboard',   desc: 'Real-time tracking: videos watched, streaks, quiz scores.' },
  { icon: '⭐', title: 'XP, Badges & Streaks',        desc: 'Gamified rewards that keep every student motivated daily.' },
];

const STATS = [
  { n: '1,200+', l: 'Active Learners' },
  { n: '94%',    l: 'Comprehension Rate' },
  { n: '50k+',   l: 'Lessons Completed' },
  { n: '4.9 ★',  l: 'Parent Rating' },
];

/* ─── component ───────────────────────────────────────────────── */
export default function UpgrEdLanding() {
  const nav = useNavigate();
  const handleCta = () => nav('/login?role=student');

  return (
    <div style={{ background: 'var(--bg-main, #F0F5FF)', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <GrowthNavbar />

      <main style={{ paddingTop: 80 }}>

        {/* ════════════════════════════════════════
            HERO CARD — deep blue gradient
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 20px 0' }}>
          <div style={{
            maxWidth: 900, margin: '0 auto',
            borderRadius: 28,
            background: 'linear-gradient(135deg, #0F2A5C 0%, #1A3D8A 60%, #0D244F 100%)',
            padding: 'clamp(32px, 5vw, 56px)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative orbs */}
            <div style={{ position:'absolute', top:-60, right:-60, width:240, height:240, borderRadius:'50%', background:'rgba(100,150,255,0.12)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:-40, right:100, width:160, height:160, borderRadius:'50%', background:'rgba(100,150,255,0.08)', pointerEvents:'none' }} />

            <div style={{ position:'relative', zIndex:1 }}>
              <span style={{
                display: 'inline-block', padding: '5px 14px', borderRadius: 20,
                background: 'rgba(100,150,255,0.15)', border: '1px solid rgba(100,150,255,0.3)',
                color: '#93B4FF', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                marginBottom: 20,
              }}>
                SCHOOL CURRICULUM · GRADES 5–12
              </span>

              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800,
                color: '#fff', lineHeight: 1.15,
                letterSpacing: '-0.02em', marginBottom: 16, maxWidth: 560,
              }}>
                UpGrEd <em style={{ fontStyle: 'italic', color: '#93B4FF' }}>with Bloom</em>
              </h1>

              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
                A structured curriculum companion. Upload any chapter — Bloom builds your child a full week of lessons, quizzes, and checkpoints. No prep. No planning.
              </p>

              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom: 40 }}>
                <button
                  onClick={handleCta}
                  style={{
                    padding: '13px 28px', borderRadius: 22,
                    background: '#93B4FF', color: '#0F1F4A',
                    border: 'none', fontSize: 15, fontWeight: 700,
                    cursor: 'pointer', letterSpacing: '0.01em',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(147,180,255,0.35)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
                >
                  Start for Free →
                </button>
                <button
                  onClick={() => nav('/upgraied')}
                  style={{
                    padding: '13px 28px', borderRadius: 22,
                    background: 'transparent', color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.2)', fontSize: 15, fontWeight: 600,
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'}
                >
                  See UpGrAIEd →
                </button>
              </div>

              {/* Stats */}
              <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
                {STATS.map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.n}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, textTransform:'uppercase', letterSpacing:'0.04em' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            THE PROCESS — Four steps
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 20px 0' }}>
          <div style={{
            maxWidth: 900, margin: '0 auto',
            background: '#fff', borderRadius: 24,
            padding: 'clamp(28px, 4vw, 44px)',
            border: '1px solid #E8E8F4',
          }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(100,150,255,0.08)', border: '1px solid rgba(100,150,255,0.25)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
              }}>⚡</div>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:'#9AA0B0', letterSpacing:'0.08em', textTransform:'uppercase', margin:0 }}>THE PROCESS</p>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#0F1F4A', margin:0, letterSpacing:'-0.01em' }}>
                  Four steps from chapter to mastery
                </h2>
              </div>
            </div>

            {/* Step cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))', gap:14 }}>
              {PROCESS_STEPS.map((step, i) => (
                <div key={i} style={{
                  padding: '22px 20px',
                  background: i === 0
                    ? 'linear-gradient(135deg, #0F2A5C, #1A3D8A)'
                    : '#F8F9FF',
                  borderRadius: 18,
                  border: i === 0 ? 'none' : '1px solid #E4E8F8',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(100,150,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
                >
                  <div style={{ fontSize: 24, marginBottom: 12 }}>{step.icon}</div>
                  <div style={{
                    fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
                    color: i === 0 ? 'rgba(147,180,255,0.8)' : '#C5CADB',
                    marginBottom: 8,
                  }}>{step.num}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: i === 0 ? '#fff' : '#0F1F4A', marginBottom: 6 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 12, color: i === 0 ? 'rgba(255,255,255,0.55)' : '#7A84A0', lineHeight: 1.55 }}>
                    {step.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FEATURES
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 20px 0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#9AA0B0', letterSpacing:'0.08em', textTransform:'uppercase', margin:'0 0 6px' }}>FEATURES</p>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#0F1F4A', margin:0, letterSpacing:'-0.01em' }}>
                Everything a student needs to succeed
              </h2>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:12 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 18,
                  padding: '22px', border: '1px solid #E8E8F4',
                  display:'flex', gap:14, alignItems:'flex-start',
                  transition: 'box-shadow 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 24px rgba(100,150,255,0.08)'; e.currentTarget.style.transform='translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: 'rgba(100,150,255,0.07)', border: '1px solid rgba(100,150,255,0.12)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize: 20, flexShrink: 0,
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#0F1F4A', marginBottom:4 }}>{f.title}</div>
                    <div style={{ fontSize:13, color:'#7A84A0', lineHeight:1.55 }}>{f.desc}</div>
                  </div>
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
            background: 'linear-gradient(135deg, #1A3D8A 0%, #4C6EF5 100%)',
            padding: '40px 36px',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:20,
          }}>
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#fff', margin:'0 0 8px', letterSpacing:'-0.01em' }}>
                Ready to try it with a real chapter?
              </h2>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.7)', margin:0 }}>
                Upload any chapter in under 60 seconds. Free forever for one chapter.
              </p>
            </div>
            <button
              onClick={handleCta}
              style={{
                padding: '13px 28px', borderRadius: 22,
                background: '#fff', color: '#0F1F4A',
                border: 'none', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', whiteSpace:'nowrap',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
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
        borderTop: '1px solid #E4E8F4',
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
                background:'linear-gradient(135deg,#93B4FF,#4C6EF5)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:15,
              }}>📚</div>
              <span style={{ fontSize:17, fontWeight:800, color:'#0F1F4A', letterSpacing:'-0.01em' }}>UpGrEd</span>
            </div>
            <p style={{ fontSize:12, color:'#7A84A0', lineHeight:1.65, margin:0 }}>
              AI-powered school curriculum help for children aged 10–18. Chapter to mastery, every time.
            </p>
          </div>
          <div style={{ display:'flex', gap:40, flexWrap:'wrap' }}>
            {[
              { heading:'Product', links:[['Home','/'],['UpGrAIEd','/upgraied'],['UpGrEd','/upgred']] },
              { heading:'Company', links:[['Book Demo','/book-demo'],['Contact','mailto:hello@upgraied.com']] },
            ].map(col => (
              <div key={col.heading}>
                <div style={{ fontSize:11, fontWeight:700, color:'#C5CADB', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:14 }}>{col.heading}</div>
                {col.links.map(([label, path]) => (
                  <div key={label} style={{ marginBottom:10 }}>
                    <a
                      href={path.startsWith('mailto') ? path : undefined}
                      onClick={path.startsWith('mailto') ? undefined : () => window.location.href = path}
                      style={{ fontSize:13, color:'#5A6B7E', cursor:'pointer', textDecoration:'none', transition:'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color='#0F1F4A'}
                      onMouseLeave={e => e.currentTarget.style.color='#5A6B7E'}
                    >{label}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth:900, margin:'24px auto 0', borderTop:'1px solid #E4E8F4', paddingTop:20, textAlign:'center', fontSize:11, color:'#C5CADB' }}>
          © 2026 UpGrAIEd · All rights reserved · Built for the next generation.
        </div>
      </footer>
    </div>
  );
}
