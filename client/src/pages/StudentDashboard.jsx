import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import StreakCard from '../components/progress/StreakCard'
import UnlockCard from '../components/progress/UnlockCard'
import RobComebackCard from '../components/progress/RobComebackCard'
import { useStudentProgress } from '../context/StudentProgressContext'
import RobCharacter from '../components/ROB/RobCharacter'
import RobFloating from '../components/ROB/RobFloating'
import RobLesson from '../components/ROB/RobLesson'
import RobLessonModal from '../components/ROB/RobLessonModal'
import RobGreetingCard from '../components/ROB/RobGreetingCard'
import RobOnboardingModal from '../components/ROB/RobOnboardingModal'
import RobQuizPanel from '../components/ROB/RobQuizPanel'
import RobGamePanel from '../components/ROB/RobGamePanel'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { useAuth } from '../context/AuthContext'
import { useROB } from '../context/RobContext'
import { useToast } from '../components/ui/Toast'
import { ROB_BADGES, ROB_LEVEL_TITLES, robLessons } from '../data/robLessons'
import {
  getCurriculum,
  getStudentLevels,
  getStudentProgress,
  getStudentStats,
} from '../services/api'

const NAV_ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'courses', icon: '📚', label: 'My Courses' },
  { id: 'progress', icon: '📈', label: 'Progress' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'S'
}

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const {
    robName,
    companionData,
    robXP,
    robLevel,
    levelProgress,
    levelTitle,
    badges,
    lessonsCompleted,
    xpToday,
    addBadge,
    completeLesson,
  } = useROB()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { progress, isCompleted, isUnlocked, isInactive } = useStudentProgress()
  const quizPanelRef = useRef(null)
  const gamePanelRef = useRef(null)

  const displayName = robName || 'ROB'

  const [activeTab, setActiveTab] = useState('home')
  const [loading, setLoading] = useState(true)
  const [progressData, setProgressData] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [levelsData, setLevelsData] = useState([])
  const [curriculum, setCurriculum] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [activeLesson, setActiveLesson] = useState(null)

  useEffect(() => {
    Promise.all([
      getStudentProgress().catch(() => null),
      getStudentStats().catch(() => null),
      getStudentLevels().catch(() => []),
      getCurriculum().catch(() => []),
    ])
      .then(([progress, stats, levels, nextCurriculum]) => {
        setProgressData(progress)
        setStatsData(stats)
        setLevelsData(levels)
        setCurriculum(nextCurriculum)
      })
      .catch(err => console.error('Failed to fetch data', err))
      .finally(() => setLoading(false))
  }, [user?._id])

  useEffect(() => {
    if (!loading && !robName) setShowOnboarding(true)
  }, [loading, robName])

  const firstName = user?.name?.split(' ')[0] || 'Student'

  const activeCurriculumModule = useMemo(() => {
    if (progressData?.currentModule) return progressData.currentModule
    for (const level of curriculum) {
      const m = level.modules?.find(mod => mod.status === 'active')
      if (m) return m
    }
    return curriculum[0]?.modules?.[0] || null
  }, [curriculum, progressData])

  const handleLessonComplete = (lesson, answeredCorrectly) => {
    completeLesson(lesson.id, lesson.xpReward)
    if (lesson.badgeId) addBadge(lesson.badgeId)
    setActiveLesson(null)
    showToast(
      answeredCorrectly
        ? `+${lesson.xpReward} XP — ${displayName} learned ${lesson.title}!`
        : `Concept saved — you still earned +${lesson.xpReward} XP.`,
      'success'
    )
  }

  const todayLesson = useMemo(
    () => robLessons.find(l => !lessonsCompleted.includes(l.id)) || null,
    [lessonsCompleted]
  )

  const earnedBadgeCards = useMemo(
    () => ROB_BADGES.map(badge => ({ ...badge, earned: badges.includes(badge.id) })),
    [badges]
  )

  const ringCircumference = 2 * Math.PI * 54
  const ringOffset = ringCircumference * (1 - levelProgress / 100)

  const levelRows = useMemo(() => {
    const routeLevels = Array.isArray(levelsData) && levelsData.length
      ? levelsData.map((level, i) => ({ number: i + 1, title: level.name || ROB_LEVEL_TITLES[i + 1] || `Level ${i + 1}` }))
      : null
    return Array.from({ length: 11 }, (_, i) => {
      const number = i + 1
      const pct = number < robLevel ? 100 : number === robLevel ? Math.round(levelProgress) : 0
      return {
        number,
        title: routeLevels?.[i]?.title || ROB_LEVEL_TITLES[number] || `Level ${number}`,
        percentage: pct,
        status: number < robLevel ? 'completed' : number === robLevel ? 'active' : 'locked',
      }
    })
  }, [levelProgress, levelsData, robLevel])

  const modulesDone = statsData?.modulesCompleted || statsData?.modules || lessonsCompleted.length
  const streak = statsData?.streak || companionData?.streak || 0

  const scrollToQuiz = () => quizPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  const scrollToGame = () => gamePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  if (loading) return <LoadingSkeleton rows={5} />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style>{`
        @keyframes barShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes dashboardRise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes confettiBurst {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
        }
        .rob-shimmer-bar {
          background-image: linear-gradient(90deg, #FF5C28, #7B3FE4, #FF5C28);
          background-size: 200% 100%;
          animation: barShimmer 3.4s linear infinite;
        }
        .hoverable-card {
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
        }
        .hoverable-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }
        @media (max-width: 1040px) {
          .student-progress-grid,
          .student-quiz-game-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .student-badges-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      <Sidebar
        items={NAV_ITEMS}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        userName={user?.name || 'Student'}
        userRole={user?.role || 'student'}
        userInitials={getInitials(user?.name)}
        onSignOut={logout}
      />

      <main className="main-content" style={{ animation: 'dashboardRise 0.28s ease' }}>
        <RobOnboardingModal visible={showOnboarding} onComplete={() => setShowOnboarding(false)} />

        <header style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="clash-display" style={{ fontSize: 28, marginBottom: 4 }}>Mission Control</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Welcome back, {firstName} 👋</p>
          </div>
          {todayLesson && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setActiveLesson(todayLesson)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, fontSize: 14 }}
            >
              <span>🎓</span>
              <span>Today's {displayName} Lesson</span>
            </button>
          )}
        </header>

        {/* ROB HQ Hero */}
        <RobGreetingCard
          onContinueMission={() => navigate(`/player/${activeCurriculumModule?._id || ''}`)}
          onScrollToQuiz={scrollToQuiz}
          onScrollToGame={scrollToGame}
          streak={streak}
          badges={badges}
        />

        {/* ── Progress-aware learning section ───────────────────── */}

        {/* Comeback card — shown only when inactive 2+ days */}
        {isInactive() && progress.completedModules.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <RobComebackCard
              robName={displayName}
              robColor={companionData?.color || 'cyan'}
              daysMissed={3}
              onQuickQuiz={scrollToQuiz}
              onResume={() => navigate(isCompleted('L1M1') ? '/student/module/2' : '/student/module/1')}
            />
          </div>
        )}

        {/* Module roadmap */}
        <div style={{ marginBottom: 20 }}>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>
              🗺 Level 1 Roadmap
            </div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#9B6FF4',
              background: 'rgba(123,63,228,0.12)',
              border: '1px solid rgba(123,63,228,0.25)',
              borderRadius: 20, padding: '3px 12px',
            }}>
              {progress.completedModules.length} / 4 Complete
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            {[
              { key: 'L1M1', icon: '🤖', title: 'ROB Saves Your Day', xp: 50,  route: '/student/module/1' },
              { key: 'L1M2', icon: '💬', title: 'Better Questions',    xp: 60,  route: '/student/module/2' },
              { key: 'L1M3', icon: '📚', title: 'ROB Becomes Tutor',   xp: 75,  route: '/student/module/3' },
              { key: 'L1M4', icon: '🔍', title: 'Catch ROB Wrong',     xp: 80,  route: '/student/module/4' },
            ].map((mod, idx) => {
              const done    = isCompleted(mod.key)
              const active  = isUnlocked(mod.key) && !done
              const locked  = !isUnlocked(mod.key) && !done

              return (
                <button
                  key={mod.key}
                  disabled={locked}
                  onClick={() => !locked && navigate(mod.route)}
                  style={{
                    textAlign: 'left', cursor: locked ? 'not-allowed' : 'pointer',
                    background: done
                      ? 'rgba(34,197,94,0.08)'
                      : active
                        ? 'linear-gradient(135deg, rgba(123,63,228,0.15), rgba(155,111,244,0.08))'
                        : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${done ? 'rgba(34,197,94,0.3)' : active ? 'rgba(123,63,228,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 16, padding: '14px 14px',
                    opacity: locked ? 0.4 : 1,
                    transition: 'all 0.25s',
                    boxShadow: active ? '0 0 20px rgba(123,63,228,0.12)' : 'none',
                  }}
                  onMouseEnter={e => { if (!locked) { e.currentTarget.style.transform = 'translateY(-2px)' } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = '' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{done ? '✅' : locked ? '🔒' : mod.icon}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 800, letterSpacing: 1,
                      color: done ? '#4ADE80' : active ? '#9B6FF4' : 'var(--text-muted)',
                      textTransform: 'uppercase',
                    }}>
                      {done ? 'Done' : active ? 'Available' : 'Locked'}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 700, lineHeight: 1.35,
                    color: done ? '#4ADE80' : 'var(--text-primary)',
                    marginBottom: 6,
                    textDecoration: done ? 'line-through' : 'none',
                  }}>
                    M{idx + 1}. {mod.title}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#FFD700' }}>+{mod.xp} XP</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Unlock card — only show when M1 done and M2 unlocked */}
        {isCompleted('L1M1') && isUnlocked('L1M2') && (
          <div style={{ marginBottom: 20 }}>
            <UnlockCard
              moduleKey="L1M2"
              title="Better Questions, Better Answers"
              subtitle="Learn why better prompts give smarter AI answers. The secret skill every AI champion needs."
              xp={60}
              duration="12 min"
              icon="💬"
              onStart={() => navigate('/student/module/2')}
            />
          </div>
        )}

        {/* Module 1 CTA — only show when not yet completed */}
        {!isCompleted('L1M1') && (
          <div style={{
            marginBottom: 20,
            background: 'linear-gradient(135deg, rgba(123,63,228,0.12), rgba(0,212,255,0.07))',
            border: '1px solid rgba(123,63,228,0.3)',
            borderRadius: 16, padding: '18px 24px',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: 28 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>
                Module 1 · ROB Saves Your Day with AI
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                10 min · Beginner · +50 XP · Your first lesson!
              </div>
            </div>
            <button
              onClick={() => navigate('/student/module/1')}
              style={{
                background: 'linear-gradient(135deg, #7B3FE4, #5B2DB4)',
                border: 'none', borderRadius: 12, padding: '11px 24px',
                color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(123,63,228,0.4)',
                transition: 'all 0.2s',
              }}
            >
              Start Lesson →
            </button>
          </div>
        )}

        {/* Streak card */}
        <div style={{ marginBottom: 24 }}>
          <StreakCard
            streakDays={progress.streakDays}
            lastStreakDate={progress.lastStreakDate}
          />
        </div>

        {/* Inline Quiz + Game */}
        <section className="student-quiz-game-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          <div ref={quizPanelRef}>
            <RobQuizPanel currentModuleId={activeCurriculumModule?._id} />
          </div>
          <div ref={gamePanelRef}>
            <RobGamePanel />
          </div>
        </section>

        {/* Progress + XP Ring */}
        <section className="student-progress-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24, marginBottom: 32 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="clash-display" style={{ fontSize: 20, marginBottom: 16 }}>📊 Learning Journey</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {levelRows.map((row, index) => (
                <div key={row.number} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 44px 22px', gap: 10, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Level {row.number}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{row.title}</div>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${row.percentage}%`, height: '100%', borderRadius: 999,
                      background: row.status === 'completed' ? '#4CD964' : row.status === 'active' ? 'linear-gradient(90deg, #FF5C28, #7B3FE4)' : 'rgba(255,255,255,0.06)',
                      transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${index * 80}ms`,
                    }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.percentage}%</div>
                  <div>{row.status === 'completed' ? '✅' : row.status === 'active' ? '▶️' : '🔒'}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="140" height="170" viewBox="0 0 140 170">
                <defs>
                  <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF5C28" />
                    <stop offset="100%" stopColor="#7B3FE4" />
                  </linearGradient>
                </defs>
                <circle cx="70" cy="70" r="54" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
                <circle cx="70" cy="70" r="54" stroke="url(#ringGrad)" strokeWidth="12" strokeLinecap="round" fill="none"
                  strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
                  transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                <text x="70" y="68" textAnchor="middle" fill="white" fontSize="36" fontFamily="Clash Display, Inter, sans-serif">{robLevel}</text>
                <text x="70" y="90" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14">Level</text>
                <text x="70" y="156" textAnchor="middle" fill="white" fontSize="20" fontFamily="Clash Display, Inter, sans-serif">{robXP} XP</text>
              </svg>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['📚', modulesDone, 'Modules'],
                ['🏆', badges.length, 'Badges'],
                ['🔥', streak, 'Day Streak'],
                ['⚡', xpToday, 'XP Today'],
              ].map(([icon, value, label]) => (
                <div key={label} style={{ padding: 14, borderRadius: 16, background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: 22 }}>{icon}</div>
                  <div className="clash-display" style={{ fontSize: 22 }}>{value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Badges */}
        <section style={{ marginBottom: 40 }}>
          <div className="section-header" style={{ marginBottom: 16 }}>
            <span className="section-title">🏆 Your Badges</span>
            <button type="button" className="btn-ghost">View all →</button>
          </div>
          <div className="student-badges-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {earnedBadgeCards.map(badge => (
              <div
                key={badge.id}
                className="hoverable-card"
                style={{
                  padding: 18, borderRadius: 20, background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center',
                  opacity: badge.earned ? 1 : 0.4, filter: badge.earned ? 'none' : 'grayscale(1)',
                }}
              >
                <div style={{
                  width: 72, height: 72, margin: '0 auto 12px', borderRadius: '50%', padding: 2,
                  background: 'linear-gradient(135deg, #FF5C28, #7B3FE4)',
                  boxShadow: badge.earned ? '0 0 20px rgba(123,63,228,0.4)' : 'none',
                }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0F0B1C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                    {badge.emoji}
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{badge.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{badge.earned ? '✅ Earned' : '🔒 Locked'}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <RobFloating currentModuleId={activeCurriculumModule?._id} />

      <RobLessonModal open={Boolean(activeLesson)} onClose={() => setActiveLesson(null)}>
        {activeLesson && (
          <RobLesson lesson={activeLesson} onComplete={handleLessonComplete} />
        )}
      </RobLessonModal>
    </div>
  )
}
