import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandTopBar from '../components/brand/BrandTopBar';

const STATS = [
  { n: '1,200+', l: 'Active Learners' },
  { n: '94%', l: 'Comprehension Rate' },
  { n: '50k+', l: 'Lessons Done' },
  { n: '4.9★', l: 'Parent Rating' },
];

const FEATURES = [
  { icon: '🎬', title: 'Expert Video Lessons', desc: 'Human-created, curriculum-driven teaching — Bloom enhances, never replaces.' },
  { icon: '⏸', title: 'Bloom Pause Checkpoints', desc: 'AI pauses the video at key moments, checks understanding, then continues.' },
  { icon: '🧠', title: 'Adaptive Learning', desc: 'Weak areas tracked automatically. The next question adapts to your level.' },
  { icon: '📊', title: 'Parent Visibility', desc: 'Real-time progress, quiz scores, streaks — all visible to parents.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'OTP login, single-session, DRM-protected video — fully safe.' },
  { icon: '💳', title: 'Simple Payments', desc: 'UPI, card, net banking. Auto GST invoice after every payment.' },
];

const WHO = [
  { emoji: '👧', role: 'Students', sub: 'Grades 5–12', color: '#6EDC5F', bg: 'rgba(110,220,95,0.06)', border: 'rgba(110,220,95,0.2)', points: ['Watch expert video lessons', 'Answer Bloom\'s AI checkpoints', 'Earn XP and level up', 'Track weak areas with Bloom'] },
  { emoji: '👩', role: 'Parents', sub: 'Full visibility', color: '#60A5FA', bg: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.18)', points: ['Live progress dashboard', 'Quiz scores & streaks', 'Weak area alerts', 'Download GST invoices'] },
  { emoji: '🛠', role: 'Admins', sub: 'Full control', color: '#A78BFA', bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.18)', points: ['Manage students & modules', 'Upload & manage videos', 'Set checkpoint questions', 'Configure platform UI'] },
];

const STEPS = [
  { n: '01', icon: '📱', t: 'Login with OTP', s: 'Secure Indian mobile OTP — no passwords needed.' },
  { n: '02', icon: '🎬', t: 'Watch the lesson', s: 'Human-created expert video, streamed securely.' },
  { n: '03', icon: '⏸', t: 'Bloom checks in', s: 'AI pauses, asks a question, evaluates your answer.' },
  { n: '04', icon: '⭐', t: 'Earn XP & grow', s: 'Level up with streaks and parent-visible milestones.' },
];

function OrbBg() {
  return (
    <>
      <div style={{ position:'absolute', top:-120, right:-80, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(110,220,95,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-100, left:-60, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(77,110,255,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'40%', left:'30%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(110,220,95,0.05) 0%, transparent 70%)', pointerEvents:'none' }} />
    </>
  );
}

export default function Home() {
  const nav = useNavigate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div style={{ background: '#060D0A', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif", overflowX: 'hidden' }}>
      <BrandTopBar dark />

      {/* ── HERO ─────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(100px,14vw,160px) 24px 80px', overflow: 'hidden' }}>
        <OrbBg />
        {/* grid lines */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(110,220,95,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(110,220,95,0.04) 1px, transparent 1px)', backgroundSize:'80px 80px', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:820, margin:'0 auto', textAlign:'center', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition:'all 0.7s cubic-bezier(0.4,0,0.2,1)' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px 6px 10px', borderRadius:40, background:'rgba(110,220,95,0.1)', border:'1px solid rgba(110,220,95,0.25)', marginBottom:28 }}>
            <span style={{ background:'linear-gradient(135deg,#6EDC5F,#3DAA3A)', borderRadius:20, padding:'2px 10px', fontSize:10, fontWeight:800, color:'#0A1F12', letterSpacing:'0.06em' }}>NEW</span>
            <span style={{ fontSize:12, color:'rgba(110,220,95,0.9)', fontWeight:500 }}>AI-powered learning with Bloom · Now live for Grades 5–12</span>
          </div>

          <h1 style={{ fontSize:'clamp(40px,6vw,76px)', fontWeight:900, lineHeight:1.08, letterSpacing:'-0.03em', color:'#fff', marginBottom:24 }}>
            The future of learning<br />
            is <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#6EDC5F,#A8F5A2)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>intelligent</em> and <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#60A5FA,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>human</em>
          </h1>

          <p style={{ fontSize:'clamp(16px,2vw,20px)', color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:40, maxWidth:560, margin:'0 auto 40px' }}>
            Expert teachers create the lessons. Bloom — your AI companion — makes sure you truly understand them. Together, they transform passive watching into active mastery.
          </p>

          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:56 }}>
            <button onClick={() => nav('/reserve')} style={{ padding:'15px 32px', borderRadius:24, background:'linear-gradient(135deg,#6EDC5F,#3DAA3A)', color:'#0A1F12', border:'none', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 8px 28px rgba(110,220,95,0.4)', transition:'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 36px rgba(110,220,95,0.5)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 8px 28px rgba(110,220,95,0.4)'}}>
              Get Started Free →
            </button>
            <button onClick={() => nav('/upgraied')} style={{ padding:'15px 32px', borderRadius:24, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.85)', border:'1px solid rgba(255,255,255,0.15)', fontSize:15, fontWeight:600, cursor:'pointer', backdropFilter:'blur(8px)', transition:'all 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}>
              Explore Platform
            </button>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:32, justifyContent:'center', flexWrap:'wrap', marginTop:0 }}>
            {STATS.map(s => (
              <div key={s.l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{s.n}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOOM SHOWCASE ────────────────────── */}
      <section id="features" style={{ padding:'80px 24px', background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-block', padding:'4px 14px', borderRadius:20, background:'rgba(110,220,95,0.1)', border:'1px solid rgba(110,220,95,0.2)', fontSize:11, fontWeight:700, color:'#6EDC5F', letterSpacing:'0.08em', marginBottom:16 }}>BLOOM AI COMPANION</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:800, color:'#fff', letterSpacing:'-0.02em', marginBottom:16 }}>
              Not a chatbot. Your learning companion.
            </h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.5)', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>
              Bloom pauses videos intelligently, asks the right questions, tracks weak areas, and grows alongside every student's journey.
            </p>
          </div>

          {/* Bloom interaction preview card */}
          <div style={{ background:'linear-gradient(135deg,#0F2A1A,#0A1F12)', borderRadius:28, padding:'clamp(24px,4vw,48px)', border:'1px solid rgba(110,220,95,0.15)', marginBottom:40, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'rgba(110,220,95,0.07)', pointerEvents:'none' }} />
            <div style={{ display:'flex', flexWrap:'wrap', gap:32, alignItems:'center' }}>
              <div style={{ flex:'1 1 300px' }}>
                <div style={{ fontSize:12, fontWeight:700, color:'rgba(110,220,95,0.7)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:12 }}>HOW IT WORKS</div>
                {STEPS.map((s,i) => (
                  <div key={i} style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:20 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background: i===0 ? 'rgba(110,220,95,0.2)' : 'rgba(255,255,255,0.05)', border:`1px solid ${i===0?'rgba(110,220,95,0.3)':'rgba(255,255,255,0.08)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:'rgba(110,220,95,0.6)', letterSpacing:'0.06em', marginBottom:3 }}>{s.n}</div>
                      <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:3 }}>{s.t}</div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.5 }}>{s.s}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Interactive preview mock */}
              <div style={{ flex:'1 1 280px' }}>
                <div style={{ background:'rgba(0,0,0,0.4)', borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
                  {/* fake video */}
                  <div style={{ height:160, background:'linear-gradient(135deg,#0D2318,#0A1410)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                    <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(110,220,95,0.2)', border:'2px solid rgba(110,220,95,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>▶</div>
                    <div style={{ position:'absolute', bottom:12, left:12, right:12, height:3, background:'rgba(255,255,255,0.1)', borderRadius:2 }}>
                      <div style={{ width:'42%', height:'100%', background:'linear-gradient(90deg,#6EDC5F,#3DAA3A)', borderRadius:2 }} />
                    </div>
                    {/* PAUSED overlay */}
                    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:28, marginBottom:6 }}>🌿</div>
                        <div style={{ fontSize:11, color:'rgba(110,220,95,0.9)', fontWeight:700 }}>Bloom paused the video</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding:16 }}>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:10, lineHeight:1.5 }}>💬 "Why does the rate of evaporation increase in sunlight?"</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                      {['More UV rays', 'Higher temperature', 'Wind speed increases', 'Less humidity'].map((o,i) => (
                        <div key={i} style={{ padding:'8px 10px', borderRadius:8, background: i===1 ? 'rgba(110,220,95,0.15)' : 'rgba(255,255,255,0.04)', border: i===1 ? '1px solid rgba(110,220,95,0.4)' : '1px solid rgba(255,255,255,0.07)', fontSize:11, color: i===1 ? '#6EDC5F' : 'rgba(255,255,255,0.6)', cursor:'pointer' }}>{o}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────── */}
      <section style={{ padding:'80px 24px' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div style={{ display:'inline-block', padding:'4px 14px', borderRadius:20, background:'rgba(96,165,250,0.1)', border:'1px solid rgba(96,165,250,0.2)', fontSize:11, fontWeight:700, color:'#60A5FA', letterSpacing:'0.08em', marginBottom:16 }}>PLATFORM</div>
            <h2 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, color:'#fff', letterSpacing:'-0.02em' }}>Built for Indian learners, from the ground up</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {FEATURES.map((f,i) => (
              <div key={i}
                style={{ background:'rgba(255,255,255,0.03)', borderRadius:20, padding:'24px 22px', border:'1px solid rgba(255,255,255,0.07)', transition:'all 0.2s', cursor:'default' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(110,220,95,0.05)';e.currentTarget.style.border='1px solid rgba(110,220,95,0.15)';e.currentTarget.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.border='1px solid rgba(255,255,255,0.07)';e.currentTarget.style.transform='none'}}>
                <div style={{ fontSize:28, marginBottom:14 }}>{f.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:6 }}>{f.title}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────── */}
      <section style={{ padding:'80px 24px', background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, color:'#fff', letterSpacing:'-0.02em', marginBottom:12 }}>Designed for everyone in the learning journey</h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', maxWidth:440, margin:'0 auto' }}>One platform, three perspectives — student, parent, and admin.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {WHO.map((w,i) => (
              <div key={i} style={{ background:w.bg, border:`1px solid ${w.border}`, borderRadius:22, padding:'28px 24px', transition:'transform 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                <div style={{ fontSize:36, marginBottom:12 }}>{w.emoji}</div>
                <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:2 }}>{w.role}</div>
                <div style={{ fontSize:11, fontWeight:700, color:w.color, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:18 }}>{w.sub}</div>
                <ul style={{ margin:0, padding:0, listStyle:'none' }}>
                  {w.points.map((p,j) => (
                    <li key={j} style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.65, marginBottom:8, display:'flex', gap:8 }}>
                      <span style={{ color:w.color, fontWeight:700, flexShrink:0 }}>✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPGRED TEASER ────────────────────── */}
      <section style={{ padding:'80px 24px' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ borderRadius:24, background:'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(96,165,250,0.06))', border:'1px solid rgba(167,139,250,0.2)', padding:'clamp(32px,5vw,56px)', display:'flex', flexWrap:'wrap', gap:32, alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ display:'inline-block', padding:'4px 14px', borderRadius:20, background:'rgba(167,139,250,0.12)', border:'1px solid rgba(167,139,250,0.25)', fontSize:11, fontWeight:700, color:'#A78BFA', letterSpacing:'0.08em', marginBottom:16 }}>COMING SOON</div>
              <h2 style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:800, color:'#fff', letterSpacing:'-0.02em', marginBottom:10 }}>UpGrEd Ecosystem Platform</h2>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', maxWidth:440, lineHeight:1.7 }}>Schools, educator tools, curriculum marketplace, certification systems — the institutional layer of the UpGrAIEd ecosystem. Coming in Phase 2.</p>
            </div>
            <button onClick={() => nav('/upgred')} style={{ padding:'13px 28px', borderRadius:22, background:'rgba(167,139,250,0.15)', border:'1px solid rgba(167,139,250,0.3)', color:'#A78BFA', fontSize:14, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(167,139,250,0.25)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(167,139,250,0.15)'}>
              Learn More →
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────── */}
      <section style={{ padding:'0 24px 80px' }}>
        <div style={{ maxWidth:960, margin:'0 auto', borderRadius:28, background:'linear-gradient(135deg,#1A3D2B,#0F5132)', padding:'clamp(36px,5vw,56px)', textAlign:'center', position:'relative', overflow:'hidden', border:'1px solid rgba(110,220,95,0.15)' }}>
          <div style={{ position:'absolute', top:-60, right:-40, width:240, height:240, borderRadius:'50%', background:'rgba(110,220,95,0.1)', pointerEvents:'none' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#fff', letterSpacing:'-0.02em', marginBottom:14 }}>Ready to start learning with Bloom?</h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:32, maxWidth:440, margin:'0 auto 32px' }}>Join 1,200+ students already learning smarter. Free to get started — no credit card needed.</p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={() => nav('/reserve')} style={{ padding:'14px 32px', borderRadius:24, background:'#6EDC5F', color:'#0A1F12', border:'none', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 6px 24px rgba(110,220,95,0.35)', transition:'transform 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                Get Started Free →
              </button>
              <button onClick={() => nav('/login')} style={{ padding:'14px 28px', borderRadius:24, background:'transparent', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.2)', fontSize:15, fontWeight:600, cursor:'pointer', transition:'border-color 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'}>
                Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer style={{ padding:'40px 24px 48px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth:960, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:32 }}>
          <div style={{ maxWidth:240 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#6EDC5F,#3DAA3A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🌿</div>
              <span style={{ fontSize:17, fontWeight:800, color:'#fff' }}>UpGrAIEd</span>
            </div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', lineHeight:1.7 }}>AI-powered learning for the next generation of builders. Grades 5–12.</p>
          </div>
          <div style={{ display:'flex', gap:48, flexWrap:'wrap' }}>
            {[
              { h:'Products', links:[['UpGrAIEd Learning','/upgraied'],['UpGrEd (Soon)','/upgred'],['Pricing','/pricing']] },
              { h:'Company',  links:[['About','/why'],['Book Demo','/book-demo'],['Login','/login']] },
            ].map(col => (
              <div key={col.h}>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.25)', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:14 }}>{col.h}</div>
                {col.links.map(([l,p]) => (
                  <div key={l} style={{ marginBottom:10 }}>
                    <span onClick={() => nav(p)} style={{ fontSize:13, color:'rgba(255,255,255,0.4)', cursor:'pointer', transition:'color 0.15s' }}
                      onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>{l}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth:960, margin:'32px auto 0', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:24, textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.2)' }}>
          © 2026 UpGrAIEd · All rights reserved · Built for the next generation of thinkers.
        </div>
      </footer>
    </div>
  );
}

