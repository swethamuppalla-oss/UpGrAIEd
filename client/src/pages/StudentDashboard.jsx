import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import RobCharacter from '../components/ROB/RobCharacter'
import RobFloating from '../components/ROB/RobFloating'
import RobLesson from '../components/ROB/RobLesson'
import RobLessonModal from '../components/ROB/RobLessonModal'
import RobBuddyPanel from '../components/ROB/RobBuddyPanel'
import RobGreetingCard from '../components/ROB/RobGreetingCard'
import RobOnboardingModal from '../components/ROB/RobOnboardingModal'
import RobQuickRecap from '../components/ROB/RobQuickRecap'
import RobMiniGame from '../components/ROB/RobMiniGame'
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
  return name.split(' ').filter(Boolean).slice(0, 2).map(word => word[0].toUpperCase()).join('') || 'S'
}

function getSubtitle(hour) {
  if (hour < 12) return 'Ready to make ROB smarter today? ☀️'
  if (hour < 18) return 'ROB missed you! Let us learn! 🤖'
  return 'Night owl learning! ROB approves! 🦉'
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

  const [activeTab, setActiveTab] = useState('home')
  const [loading, setLoading] = useState(true)
  const [progressData, setProgressData] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [levelsData, setLevelsData] = useState([])
  const [curriculum, setCurriculum] = useState([])
  const [showBuddyPanel, setShowBuddyPanel] = useState(false)
  
  // ROB Modal States
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showRecap, setShowRecap] = useState(false)
  const [showMiniGame, setShowMiniGame] = useState(false)
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
      .catch((err) => console.error('Failed to fetch data', err))
      .finally(() => setLoading(false))
  }, [user?._id])

  useEffect(() => {
    if (!loading && !robName) {
      setShowOnboarding(true)
    }
  }, [loading, robName])

  const firstName = user?.name?.split(' ')[0] || 'Student'

  const activeCurriculumModule = useMemo(() => {
    const currentModule = progressData?.currentModule
    if (currentModule) return currentModule

    for (const level of curriculum) {
      const activeModule = level.modules?.find(module => module.status === 'active')
      if (activeModule) return activeModule
    }

    return curriculum[0]?.modules?.[0] || null
  }, [curriculum, progressData])

  const handleStartMission = () => {
    navigate(`/player/${activeCurriculumModule?._id || ''}`)
  }

  const handleLessonComplete = (lesson, answeredCorrectly) => {
    completeLesson(lesson.id, lesson.xpReward)
    if (lesson.badgeId) addBadge(lesson.badgeId)
    setActiveLesson(null)
    showToast(
      answeredCorrectly
        ? `+${lesson.xpReward} XP — ROB learned ${lesson.title}!`
        : `ROB's concept saved — you still earned +${lesson.xpReward} XP.`,
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
      ? levelsData.map((level, index) => ({
        number: index + 1,
        title: level.name || ROB_LEVEL_TITLES[index + 1] || `Level ${index + 1}`,
      }))
      : null

    return Array.from({ length: 11 }, (_, index) => {
      const number = index + 1
      const percentage = number < robLevel ? 100 : number === robLevel ? Math.round(levelProgress) : 0
      return {
        number,
        title: routeLevels?.[index]?.title || ROB_LEVEL_TITLES[number] || `Level ${number}`,
        percentage,
        status: number < robLevel ? 'completed' : number === robLevel ? 'active' : 'locked',
      }
    })
  }, [levelProgress, levelsData, robLevel])

  const modulesDone = statsData?.modulesCompleted || statsData?.modules || lessonsCompleted.length
  const streak = statsData?.streak || 0

  if (loading) {
    return <LoadingSkeleton rows={5} />
  }

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
        .rob-shimmer-bar {
          background-image: linear-gradient(90deg, #FF5C28, #7B3FE4, #FF5C28);
          background-size: 200% 100%;
          animation: barShimmer 3.4s linear infinite;
        }
        @media (max-width: 1040px) {
          .student-hero,
          .student-progress-grid,
          .student-continue-card {
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
        <RobOnboardingModal 
          visible={showOnboarding} 
          onComplete={() => setShowOnboarding(false)} 
        />
        <RobQuickRecap 
          visible={showRecap} 
          onClose={() => setShowRecap(false)} 
          moduleId={companionData?.lastModule || 'm1'} 
        />
        <RobMiniGame 
          visible={showMiniGame} 
          onClose={() => setShowMiniGame(false)} 
        />

        <header className="dashboard-header" style={{ marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="clash-display">Student Mission Control</h1>
            <p className="subtitle">Welcome back, {firstName}</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowBuddyPanel(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999 }}
          >
            <span style={{ fontSize: 20 }}>🤖</span>
            <span>Open ROB Buddy</span>
          </button>
        </header>

        {/* Dynamic ROB Hero Area */}
        <RobGreetingCard 
          onQuickRecap={() => setShowRecap(true)}
          onContinueMission={handleStartMission}
          onMiniGame={() => setShowMiniGame(true)}
        />


        <section className="student-progress-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24, marginBottom: 32 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="clash-display" style={{ fontSize: 22, marginBottom: 18 }}>📊 Your Learning Journey</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {loading ? (
                <>
                  <LoadingSkeleton height="40px" borderRadius="12px" />
                  <LoadingSkeleton height="40px" borderRadius="12px" />
                  <LoadingSkeleton height="40px" borderRadius="12px" />
                </>
              ) : (
                levelRows.map((row, index) => (
                  <div key={row.number} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 48px 24px', gap: 10, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>Level {row.number}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{row.title}</div>
                    </div>
                    <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${row.percentage}%`,
                          height: '100%',
                          borderRadius: 999,
                          background: row.status === 'completed'
                            ? '#4CD964'
                            : row.status === 'active'
                            ? 'linear-gradient(90deg, #FF5C28, #7B3FE4)'
                            : 'rgba(255,255,255,0.06)',
                          transition: `width 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 80}ms`,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.percentage}%</div>
                    <div>{row.status === 'completed' ? '✅' : row.status === 'active' ? '▶️' : '🔒'}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              <svg width="140" height="170" viewBox="0 0 140 170">
                <defs>
                  <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF5C28" />
                    <stop offset="100%" stopColor="#7B3FE4" />
                  </linearGradient>
                </defs>
                <circle cx="70" cy="70" r="54" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  stroke="url(#ringGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 70 70)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
                <text x="70" y="68" textAnchor="middle" fill="white" fontSize="36" fontFamily="Clash Display, Inter, sans-serif">
                  {robLevel}
                </text>
                <text x="70" y="90" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14">
                  Level
                </text>
                <text x="70" y="156" textAnchor="middle" fill="white" fontSize="20" fontFamily="Clash Display, Inter, sans-serif">
                  {robXP} XP
                </text>
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

        <section style={{ marginBottom: 32 }}>
          <div
            className="gradient-border"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 24,
              padding: 28,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  🎯 Todays Mission
                </div>
                {todayLesson ? (
                  <>
                    <div className="clash-display" style={{ fontSize: 28, marginBottom: 8 }}>
                      {todayLesson.title}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: 18 }}>
                      {todayLesson.duration} min · {todayLesson.xpReward} XP reward
                    </div>
                    <button type="button" className="btn-primary" onClick={() => setActiveLesson(todayLesson)}>
                      Start Mission →
                    </button>
                  </>
                ) : (
                  <>
                    <div className="clash-display" style={{ fontSize: 28, marginBottom: 8 }}>
                      🎉 You have trained ROB on everything!
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      ROB is now a fully trained AI buddy!
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <RobCharacter
                  size="medium"
                  emotion="excited"
                  speech={todayLesson ? 'This one is SO good! I promise! 🤖' : 'I am fully charged and ready!'}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="student-continue-card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, marginBottom: 32 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-header">
              <span className="section-title">Continue Learning</span>
            </div>

            {loading ? (
              <LoadingSkeleton height="150px" borderRadius="16px" />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                    Current Module
                  </div>
                  <div className="clash-display" style={{ fontSize: 24, marginBottom: 8 }}>
                    {activeCurriculumModule?.title || 'Pick your next lesson'}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: 14 }}>
                    {activeCurriculumModule?.taskDescription || 'ROB is waiting for your next move.'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                    <span className="badge-purple">{activeCurriculumModule?.percent || progressData?.overallPercent || 0}% complete</span>
                    {activeCurriculumModule?.isMustDo && <span className="badge-orange">Must Do</span>}
                  </div>
                  <button type="button" className="btn-primary" onClick={() => navigate('/player')}>
                    Start Mission →
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <RobCharacter size="small" emotion="teaching" speech="I saved your spot!" />
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="section-header">
            <span className="section-title">🏆 Your Badges</span>
            <button type="button" className="btn-ghost">View all →</button>
          </div>

          <div className="student-badges-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {earnedBadgeCards.map((badge) => (
              <div
                key={badge.id}
                className="hoverable-card"
                style={{
                  position: 'relative',
                  padding: 18,
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textAlign: 'center',
                  opacity: badge.earned || !badge.locked ? 1 : 0.4,
                  filter: badge.earned || !badge.locked ? 'none' : 'grayscale(1)',
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 12px',
                    borderRadius: '50%',
                    padding: 2,
                    background: 'linear-gradient(135deg, #FF5C28, #7B3FE4)',
                    boxShadow: badge.earned ? '0 0 20px rgba(123,63,228,0.4)' : 'none',
                  }}
                >
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0F0B1C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                    {badge.emoji}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-primary)' }}>{badge.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{badge.earned ? badge.date : 'Locked'}</div>
                {!badge.earned && badge.locked && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    🔒
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <RobFloating currentModuleId={activeCurriculumModule?._id} />
      <RobBuddyPanel
        open={showBuddyPanel}
        onClose={() => setShowBuddyPanel(false)}
        currentModuleId={activeCurriculumModule?._id}
      />

      <RobLessonModal open={Boolean(activeLesson)} onClose={() => setActiveLesson(null)}>
        {activeLesson && (
          <RobLesson
            lesson={activeLesson}
            onComplete={handleLessonComplete}
          />
        )}
      </RobLessonModal>
    </div>
  )
}
