import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useROB } from '../context/RobContext'
import { useToast } from '../components/ui/Toast'
import BloomCharacter from '../components/Bloom/BloomCharacter'
import BloomParticles from '../components/Bloom/BloomParticles'
import { ROB_BADGES, robLessons } from '../data/robLessons'
import { getROBQuiz } from '../services'
import '../styles/bloom.css'

const NAV = [
  { id: 'home',     icon: '🏠', label: 'Home' },
  { id: 'courses',  icon: '📚', label: 'Courses' },
  { id: 'progress', icon: '📈', label: 'Progress' },
  { id: 'rewards',  icon: '🏆', label: 'Rewards' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

// ── Mini Quiz Panel ──────────────────────────────────────────────────────────
function BloomQuizPanel({ moduleId }) {
  const { robName, addXP, recordAnswer } = useROB()
  const name = robName || 'Bloom'
  const [quiz, setQuiz] = useState(null)
  const [state, setState] = useState({ loading: true, selected: null, checked: false, correct: false })
  const [xpGained, setXpGained] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => { loadQuiz() }, [moduleId])

  const loadQuiz = () => {
    setState({ loading: true, selected: null, checked: false, correct: false })
    getROBQuiz(moduleId)
      .then(d => { setQuiz(d); setState({ loading: false, selected: null, checked: false, correct: false }) })
      .catch(() => { setQuiz({ available: false }); setState({ loading: false, selected: null, checked: false, correct: false }) })
  }

  const answer = (i) => {
    if (!quiz?.available || state.checked) return
    const ok = Boolean(quiz.options?.[i]?.isCorrect)
    setState({ loading: false, selected: i, checked: true, correct: ok })
    recordAnswer(ok)
    if (ok) { addXP(15); setXpGained(x => x + 15); setStreak(s => s + 1) }
    else setStreak(0)
  }

  return (
    <div className="bloom-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="bloom-heading" style={{ fontSize: 17 }}>🎯 Quiz Time</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {streak > 1 && <span className="bloom-pill bloom-pill-coral">🔥 {streak}x</span>}
          {xpGained > 0 && <span className="bloom-pill bloom-pill-green">+{xpGained} XP</span>}
        </div>
      </div>

      {state.loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BloomCharacter size="small" emotion="thinking" speech="Finding a great question..." />
        </div>
      )}

      {!state.loading && !quiz?.available && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center' }}>
          <BloomCharacter size="small" emotion="encouraging" speech={`Ask your teacher to train ${name}!`} />
        </div>
      )}

      {!state.loading && quiz?.available && (
        <>
          <div style={{ background: 'rgba(110,220,95,0.06)', borderRadius: 16, padding: 16, border: '1px solid rgba(110,220,95,0.12)' }}>
            <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.6, margin: 0, color: 'var(--bloom-text)' }}>{quiz.question}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(quiz.options || []).map((opt, i) => {
              const sel = state.selected === i
              const ok = Boolean(opt.isCorrect)
              return (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  disabled={state.checked}
                  className={`bloom-option ${state.checked && ok ? 'correct' : ''} ${state.checked && sel && !ok ? 'wrong' : ''}`}
                >
                  <span style={{ opacity: 0.5, marginRight: 8, fontWeight: 800 }}>{String.fromCharCode(65 + i)}.</span>
                  {opt.text}
                  {state.checked && ok && ' ✅'}
                  {state.checked && sel && !ok && ' ❌'}
                </button>
              )
            })}
          </div>
          {state.checked && (
            <div className="bloom-animate-rise">
              <div style={{
                padding: '12px 16px', borderRadius: 14, marginBottom: 10,
                background: state.correct ? 'rgba(110,220,95,0.12)' : 'rgba(255,138,101,0.12)',
                border: `1px solid ${state.correct ? 'rgba(110,220,95,0.3)' : 'rgba(255,138,101,0.3)'}`,
                fontSize: 13, color: state.correct ? '#A8F5A2' : '#FFBDA0',
              }}>
                {state.correct ? '✅ ' : '❌ '}{quiz.explanation}
              </div>
              <button className="bloom-btn bloom-btn-primary" onClick={loadQuiz} style={{ width: '100%' }}>Next Question →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Mini Game Panel ──────────────────────────────────────────────────────────
const SPEED_GAMES = [
  { target: 'Machine Learning', options: ['AI learns from examples', 'A robot factory', 'A type of computer', 'A game console'], correct: 0 },
  { target: 'Neural Network', options: ['A TV channel', 'Layers of math nodes inspired by the brain', 'A computer game', 'A phone network'], correct: 1 },
  { target: 'Dataset', options: ['A math formula', 'A collection of examples used to train AI', 'A computer program', 'A robot part'], correct: 1 },
  { target: 'Algorithm', options: ['A dance move', 'A step-by-step instruction set', 'A type of computer', 'A drawing tool'], correct: 1 },
  { target: 'Bias in AI', options: ['When AI plays favourites', 'A type of battery', 'A colour setting', 'A keyboard shortcut'], correct: 0 },
]
const T_MAX = 10, R = 16, C = 2 * Math.PI * R

function BloomGamePanel() {
  const { addXP } = useROB()
  const [round, setRound] = useState(0)
  const [t, setT] = useState(T_MAX)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState('idle')
  const [sel, setSel] = useState(null)

  useEffect(() => {
    if (phase !== 'playing') return
    if (t <= 0) { setSel(-1); setPhase('roundEnd'); return }
    const id = setInterval(() => setT(n => n - 1), 1000)
    return () => clearInterval(id)
  }, [t, phase])

  const start = () => { setRound(0); setScore(0); setSel(null); setPhase('playing'); setT(T_MAX) }

  const pick = (i) => {
    if (phase !== 'playing') return
    setSel(i)
    if (i === SPEED_GAMES[round].correct) setScore(s => s + 10 + Math.floor(t / 2))
    setPhase('roundEnd')
  }

  const next = () => {
    if (round < SPEED_GAMES.length - 1) {
      setRound(r => r + 1); setPhase('playing'); setT(T_MAX); setSel(null)
    } else {
      addXP(score + 20); setPhase('finished')
    }
  }

  const timerOffset = C * (1 - t / T_MAX)
  const isRoundEnd = phase === 'roundEnd'

  return (
    <div className="bloom-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="bloom-heading" style={{ fontSize: 17 }}>⚡ Speed Game</span>
        {phase === 'playing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r={R} stroke="rgba(110,220,95,0.15)" strokeWidth="4" fill="none" />
              <circle cx="20" cy="20" r={R}
                stroke={t <= 3 ? '#FF8A65' : '#6EDC5F'} strokeWidth="4" fill="none"
                strokeDasharray={C} strokeDashoffset={timerOffset}
                transform="rotate(-90 20 20)"
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
              />
              <text x="20" y="25" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">{t}</text>
            </svg>
            <span style={{ fontSize: 13, color: '#FFD95A', fontWeight: 800 }}>{score} pts</span>
          </div>
        )}
      </div>

      {phase === 'idle' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center' }}>
          <BloomCharacter size="small" emotion="excited" speech="I love speed rounds! 🌿" />
          <p style={{ fontSize: 13, color: 'var(--bloom-muted)', lineHeight: 1.5 }}>Match AI concepts before time runs out — faster = more XP!</p>
          <button className="bloom-btn bloom-btn-primary" onClick={start}>Start Game 🚀</button>
        </div>
      )}

      {phase === 'finished' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center' }}>
          <BloomCharacter size="small" emotion="celebrating" speech="You CRUSHED it!" />
          <div className="bloom-display-sm bloom-text-green">+{score + 20} XP</div>
          <button className="bloom-btn bloom-btn-primary" onClick={start}>Play Again 🔄</button>
        </div>
      )}

      {(phase === 'playing' || isRoundEnd) && (
        <>
          <div style={{ display: 'flex', gap: 4 }}>
            {SPEED_GAMES.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i < round ? '#6EDC5F' : i === round ? '#FFD95A' : 'rgba(110,220,95,0.15)', transition: 'background 0.3s' }} />
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: '6px 0' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--bloom-muted)', marginBottom: 6 }}>What is...</div>
            <div className="bloom-heading bloom-text-green">{SPEED_GAMES[round].target}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {SPEED_GAMES[round].options.map((opt, i) => {
              const ok = i === SPEED_GAMES[round].correct
              return (
                <button key={i} onClick={() => pick(i)} disabled={isRoundEnd}
                  className={`bloom-option ${isRoundEnd && ok ? 'correct' : ''} ${isRoundEnd && sel === i && !ok ? 'wrong' : ''}`}
                  style={{ fontSize: 12 }}>
                  {opt}
                </button>
              )
            })}
          </div>
          {isRoundEnd && (
            <button className="bloom-btn bloom-btn-primary bloom-animate-rise" onClick={next} style={{ width: '100%' }}>
              {round < SPEED_GAMES.length - 1 ? 'Next Round →' : 'Finish 🏁'}
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function BloomDashboard() {
  const { user, logout } = useAuth()
  const { robName, robXP, robLevel, levelProgress, badges, lessonsCompleted, xpToday } = useROB()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const quizRef = useRef(null)
  const gameRef = useRef(null)

  const [activeNav, setActiveNav] = useState('home')
  const displayName = robName || 'Bloom'
  const firstName = user?.name?.split(' ')[0] || 'Explorer'

  const ringC = 2 * Math.PI * 54
  const ringOff = ringC * (1 - levelProgress / 100)

  const earnedBadges = useMemo(
    () => ROB_BADGES.map(b => ({ ...b, earned: badges.includes(b.id) })),
    [badges]
  )

  const todayLesson = robLessons.find(l => !lessonsCompleted.includes(l.id)) || null

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const mood = xpToday > 100 ? 'celebrating' : xpToday > 50 ? 'excited' : 'happy'
  const speech = xpToday > 100
    ? "You're crushing it today! 🌟"
    : todayLesson
    ? `Let's learn: ${todayLesson.title}!`
    : 'You trained me on everything! 🎉'

  return (
    <div className="bloom-page" style={{ position: 'relative' }}>
      <BloomParticles count={18} zIndex={0} />

      {/* Sidebar */}
      <nav className="bloom-sidebar" style={{ zIndex: 10 }}>
        <div style={{ fontSize: 24, marginBottom: 12 }}>🌿</div>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`bloom-sidebar-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="bloom-sidebar-item" onClick={logout} title="Sign out" style={{ color: '#FF8A65' }}>
          🚪
        </button>
      </nav>

      {/* Main */}
      <main className="bloom-main-content" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div className="bloom-label">🌿 UpGrAIed</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.02, margin: 0 }}>
              {greeting}, <span className="bloom-text-green">{firstName}!</span>
            </h1>
            <p style={{ color: 'var(--bloom-muted)', margin: '4px 0 0', fontSize: 15 }}>
              {displayName} is ready to learn with you today.
            </p>
          </div>
          {todayLesson && (
            <button
              className="bloom-btn bloom-btn-primary bloom-btn-sm"
              onClick={() => showToast(`Starting: ${todayLesson.title}`, 'success')}
            >
              🎓 Today's Lesson
            </button>
          )}
        </header>

        {/* Hero Card */}
        <section className="bloom-hero-card bloom-animate-rise" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', marginBottom: 28 }}>
          {/* Green glow blobs */}
          <div style={{ position: 'absolute', top: '-30%', left: '-5%', width: '45%', height: '160%', background: 'radial-gradient(ellipse, rgba(110,220,95,0.18) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '20%', width: '30%', height: '120%', background: 'radial-gradient(ellipse, rgba(99,199,255,0.1) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

          <div style={{ padding: '44px 40px', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Stats pills */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
              <span className="bloom-pill bloom-pill-coral">🔥 {0} day streak</span>
              <span className="bloom-pill bloom-pill-yellow">⚡ {xpToday} XP today</span>
              <span className="bloom-pill bloom-pill-green">🏆 {badges.length} badges</span>
              <span className="bloom-pill bloom-pill-sky">⭐ Level {robLevel}</span>
            </div>

            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12, lineHeight: 1.1 }}>
              <span className="bloom-text-green">{displayName}</span> HQ
            </h2>
            <p style={{ color: 'var(--bloom-muted)', fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
              You need <strong style={{ color: '#FFD95A' }}>{Math.max(0, 200 - xpToday)} more XP</strong> to hit today's goal.
              Let's make it happen! 💪
            </p>

            {/* Action buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <button className="bloom-btn bloom-btn-primary" onClick={() => navigate('/player/')}>
                <span>🚀</span><div style={{ textAlign: 'left' }}><div style={{ fontSize: 13, fontWeight: 800 }}>Continue</div><div style={{ fontSize: 10, opacity: 0.7 }}>Learning</div></div>
              </button>
              <button className="bloom-btn bloom-btn-sky" onClick={() => quizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                <span>🧠</span><div style={{ textAlign: 'left' }}><div style={{ fontSize: 13, fontWeight: 800 }}>Quick</div><div style={{ fontSize: 10, opacity: 0.7 }}>Quiz</div></div>
              </button>
              <button className="bloom-btn bloom-btn-ghost" onClick={() => gameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                <span>🕹️</span><div style={{ textAlign: 'left' }}><div style={{ fontSize: 13, fontWeight: 800 }}>Play</div><div style={{ fontSize: 10, opacity: 0.7 }}>Game</div></div>
              </button>
            </div>
          </div>

          {/* Bloom mascot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28, position: 'relative', zIndex: 1 }}>
            <BloomCharacter size="large" emotion={mood} speech={speech} level={robLevel} />
          </div>
        </section>

        {/* Quiz + Game grid */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          <div ref={quizRef}><BloomQuizPanel /></div>
          <div ref={gameRef}><BloomGamePanel /></div>
        </section>

        {/* Progress + Level ring */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 24, marginBottom: 28 }}>
          {/* XP progress */}
          <div className="bloom-card">
            <div className="bloom-heading" style={{ marginBottom: 20, fontSize: 18 }}>📊 Learning Journey</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[1,2,3,4,5].map(n => {
                const active = n === robLevel
                const done = n < robLevel
                const pct = done ? 100 : active ? Math.round(levelProgress) : 0
                return (
                  <div key={n} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 40px 20px', gap: 10, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: active ? '#A8F5A2' : 'var(--bloom-muted)' }}>Level {n}</div>
                    </div>
                    <div className="bloom-progress-track">
                      <div className="bloom-progress-fill" style={{ width: `${pct}%`, background: done ? 'var(--bloom-grad-green)' : active ? 'var(--bloom-grad-warm)' : 'rgba(110,220,95,0.1)' }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--bloom-muted)', textAlign: 'right' }}>{pct}%</div>
                    <div>{done ? '✅' : active ? '🌿' : '🔒'}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* XP ring */}
          <div className="bloom-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="140" height="160" viewBox="0 0 140 160" className="bloom-xp-ring">
              <defs>
                <linearGradient id="bloom-ring-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6EDC5F" />
                  <stop offset="100%" stopColor="#63C7FF" />
                </linearGradient>
              </defs>
              <circle cx="70" cy="70" r="54" stroke="rgba(110,220,95,0.1)" strokeWidth="12" fill="none" />
              <circle cx="70" cy="70" r="54" stroke="url(#bloom-ring-grad)" strokeWidth="12" strokeLinecap="round" fill="none"
                strokeDasharray={ringC} strokeDashoffset={ringOff}
                transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
              <text x="70" y="65" textAnchor="middle" fill="#A8F5A2" fontSize="34" fontWeight="900">{robLevel}</text>
              <text x="70" y="84" textAnchor="middle" fill="rgba(168,245,162,0.6)" fontSize="13">Level</text>
              <text x="70" y="148" textAnchor="middle" fill="#FFD95A" fontSize="18" fontWeight="800">{robXP} XP</text>
            </svg>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', marginTop: 8 }}>
              {[['📚', lessonsCompleted.length, 'Done'], ['🏆', badges.length, 'Badges']].map(([icon, val, lbl]) => (
                <div key={lbl} className="bloom-stat">
                  <div style={{ fontSize: 20 }}>{icon}</div>
                  <div className="bloom-stat-value" style={{ fontSize: 22 }}>{val}</div>
                  <div className="bloom-stat-label">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Badges */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span className="bloom-heading" style={{ fontSize: 18 }}>🏆 Your Badges</span>
            <button className="bloom-btn bloom-btn-ghost bloom-btn-sm">View all →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {earnedBadges.map(b => (
              <div key={b.id} className={`bloom-badge ${b.earned ? 'earned' : 'locked'}`}>
                <div className="bloom-badge-icon" style={{ background: b.earned ? 'var(--bloom-grad-green)' : 'rgba(110,220,95,0.15)' }}>
                  {b.emoji}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: b.earned ? 'var(--bloom-text)' : 'var(--bloom-muted)' }}>{b.name}</div>
                <div style={{ fontSize: 11, color: b.earned ? '#A8F5A2' : 'var(--bloom-muted)' }}>{b.earned ? '✅ Earned' : '🔒 Locked'}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
