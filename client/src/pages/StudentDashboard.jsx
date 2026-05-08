import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import UnlockCard from '../components/progress/UnlockCard'
import { useStudentProgress } from '../context/StudentProgressContext'
import RobFloating from '../components/ROB/RobFloating'
import RobLesson from '../components/ROB/RobLesson'
import RobLessonModal from '../components/ROB/RobLessonModal'
import RobOnboardingModal from '../components/ROB/RobOnboardingModal'
import RobQuizPanel from '../components/ROB/RobQuizPanel'
import RobGamePanel from '../components/ROB/RobGamePanel'
import TodayLesson from '../components/chapter/TodayLesson'
import { useAuth } from '../context/AuthContext'
import { useROB } from '../context/RobContext'
import { useToast } from '../components/ui/Toast'
import { ROB_BADGES, ROB_LEVEL_TITLES, robLessons } from '../data/robLessons'
import {
  getCurriculum,
  getStudentLevels,
  getStudentProgress,
  getStudentStats,
} from '../services'
import { getStudentDashboard } from '../services/dashboardService'
import { useConfig } from '../context/ConfigContext'
import { getBloomMessage } from '../utils/getBloomMessage'
import { getBloomState } from '../utils/getBloomState'
import { getBloomVariant } from '../utils/getBloomVariant'
import Dashboard from '../components/dashboard/Dashboard'
import '../styles/student-dashboard.scss'

const NAV_ITEMS = [
  { id: 'div-learning', divider: true, label: 'Learning Portal' },
  { id: 'today', icon: '🎯', label: "Today's Lesson" },
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'courses', icon: '📚', label: 'My Learning' },
  { id: 'div-account', divider: true, label: 'Account & Progress' },
  { id: 'progress', icon: '📈', label: 'Progress' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

const fallbackData = {
  name: 'Student',
  grade: 6,
  progress: 50,
  accuracy: 70,
  weakAreas: [],
}

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
    accuracy,
    addBadge,
    completeLesson,
  } = useROB()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { progress, isCompleted, isUnlocked, isInactive, MODULE_MAP } = useStudentProgress()
  const quizPanelRef = useRef(null)
  const gamePanelRef = useRef(null)
  const config = useConfig()

  const displayName = robName || 'Bloom'

  const [activeTab, setActiveTab] = useState('today')
  const [loading, setLoading] = useState(true)
  const [studentData, setStudentData] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [levelsData, setLevelsData] = useState([])
  const [curriculum, setCurriculum] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [activeLesson, setActiveLesson] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getStudentDashboard()
        setStudentData(data)
        setProgressData(data?.progressData ?? data?.progress ?? null)
        setStatsData(data?.statsData ?? data?.stats ?? data ?? null)
        setLevelsData(data?.levelsData ?? data?.levels ?? [])
        setCurriculum(data?.curriculum ?? [])
      } catch (err) {
        console.error(err)
        const [progress, stats, levels, nextCurriculum] = await Promise.all([
          getStudentProgress().catch(() => null),
          getStudentStats().catch(() => null),
          getStudentLevels().catch(() => []),
          getCurriculum().catch(() => []),
        ])
        setStudentData({
          ...fallbackData,
          progressData: progress,
          statsData: stats ?? fallbackData,
          levelsData: levels,
          curriculum: nextCurriculum,
        })
        setProgressData(progress)
        setStatsData(stats ?? fallbackData)
        setLevelsData(levels)
        setCurriculum(nextCurriculum)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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

  if (loading) return <div>Loading...</div>
  if (!studentData) return <div>Error loading data</div>

  // ── Render Helpers ──────────────────────────────────────────────────────────

  const renderHomeTab = () => {
    const variant         = getBloomVariant(statsData?.grade)
    const totalModules    = Object.keys(MODULE_MAP).length
    const localDone       = progress.completedModules.length
    const displayDone     = statsData?.completed ?? localDone
    const displayAccuracy = statsData?.accuracy  ?? (accuracy > 0 ? accuracy : null)
    const displayTime     = statsData?.timeSpent ?? null
    const displayProgress = statsData?.progress  ?? (totalModules > 0 ? Math.round((localDone / totalModules) * 100) : 0)

    const weakAreas = (Array.isArray(statsData?.weakAreas) ? statsData.weakAreas : null)
      ?? Object.entries(MODULE_MAP)
        .filter(([k]) => !progress.completedModules.includes(k) && !progress.unlockedModules.includes(k))
        .map(([, m]) => m.title)

    const studentData = {
      grade: statsData?.grade,
      accuracy: displayAccuracy,
      progress: displayProgress,
      weakAreas,
    }
    const bloomVariant = getBloomState(studentData)
    const bloomDisplayVariant = { ...variant, id: bloomVariant }
    const bloomEmotion = streak >= 5 ? 'celebrating' : streak >= 2 ? 'excited' : displayDone > 0 ? 'happy' : variant.bloomEmotion
    const bloomMessage = getBloomMessage(studentData)

    const stats = [
      { label: 'Accuracy',      value: displayAccuracy != null ? `${displayAccuracy}%` : '—', icon: '🎯', color: '#6EDC5F' },
      { label: 'Concepts Done', value: displayDone,                                            icon: '📚', color: '#63C7FF' },
      { label: 'Time Spent',    value: displayTime,                                            icon: '⏱️', color: '#A78BFA', hidden: !displayTime },
      { label: 'XP Today',      value: `+${xpToday}`,                                         icon: '⚡', color: '#FFD95A' },
    ].filter(s => !s.hidden).slice(0, variant.statsCount)

    return (
      <Dashboard
        firstName={config?.ui?.text?.student_dashboard_title ? '' : firstName}
        streak={streak}
        grade={statsData?.grade}
        concept={statsData?.currentConcept || activeCurriculumModule?.title || activeCurriculumModule?.name || 'Your next lesson is ready!'}
        progress={displayProgress}
        stats={stats}
        weakAreas={weakAreas}
        conceptsDone={displayDone}
        bloomEmotion={bloomEmotion}
        bloomMessage={bloomMessage}
        bloomVariant={bloomDisplayVariant}
        robLevel={robLevel}
        robXP={robXP}
        badges={badges.length}
        onResume={() => setActiveTab('today')}
        onPractice={() => navigate('/student/practice')}
        onQuiz={scrollToQuiz}
        onDrill={scrollToGame}
        onRevisit={() => navigate(`/player/${activeCurriculumModule?._id || ''}`)}
        quizPanelRef={quizPanelRef}
        gamePanelRef={gamePanelRef}
        moduleId={activeCurriculumModule?._id}
      />
    )
  }

  const renderCoursesTab = () => (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="ui-title">My Learning Journey</h1>
        <p className="ui-text">Explore your curriculum and unlock new levels.</p>
      </div>

      <div className="ui-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="ui-title" style={{ margin: 0 }}>
            🗺 {config?.ui?.text?.student_roadmap_title || 'Level 1 Roadmap'}
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-purple-light)', background: 'rgba(123,63,228,0.12)', border: '1px solid rgba(123,63,228,0.25)', borderRadius: 20, padding: '3px 12px' }}>
            {progress.completedModules.length} / 5 Complete
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
          {curriculum.flatMap(level => level.modules || []).map((mod, idx) => {
            const done   = mod.status === 'completed' || isCompleted(mod._id) || isCompleted(mod.key)
            const active = mod.status === 'active' || isUnlocked(mod._id) || isUnlocked(mod.key)
            const locked = !done && !active
            
            const route = mod.isDynamic ? `/player/${mod._id}` : (mod.route || `/student/module/${idx + 1}`)
            
            return (
              <button key={mod._id || mod.key} disabled={locked} onClick={() => !locked && navigate(route)}
                style={{
                  textAlign: 'left', cursor: locked ? 'not-allowed' : 'pointer',
                  background: done ? 'rgba(34,197,94,0.1)' : active ? 'var(--accent-secondary)' : 'var(--bg-card)',
                  border: `1px solid ${done ? 'rgba(34,197,94,0.3)' : active ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  borderRadius: 12, padding: 14, opacity: locked ? 0.6 : 1,
                  transition: 'all 0.25s', fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column'
                }}
                onMouseEnter={e => { if (!locked) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = '' }}
              >
                {mod.thumbnail && (
                  <div style={{ width: '100%', height: 80, marginBottom: 10, borderRadius: 8, overflow: 'hidden', background: '#000' }}>
                    <img src={mod.thumbnail} alt={mod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{done ? '✅' : locked ? '🔒' : (mod.icon || '🎬')}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: done ? 'var(--accent-green)' : active ? 'var(--accent-purple-light)' : 'var(--text-muted)' }}>
                    {done ? 'Done' : active ? 'Active' : 'Locked'}
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: done ? 'var(--accent-green)' : active ? 'var(--text-inverse)' : 'var(--text-primary)', marginBottom: 4, textDecoration: done ? 'line-through' : 'none' }}>
                  {mod.title}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#FFD700' }}>+{mod.xp || 50} XP</div>
              </button>
            )
          })}
        </div>
      </div>

      {isCompleted('L1M1') && isUnlocked('L1M2') && (
        <UnlockCard
          moduleKey="L1M2"
          title="Better Questions, Better Answers"
          subtitle="Learn why better prompts give smarter AI answers. The secret skill every AI champion needs."
          xp={60}
          duration="12 min"
          icon="💬"
          onStart={() => navigate('/student/module/2')}
        />
      )}

      {isCompleted('L1M4') && isUnlocked('L2M1') && (
        <UnlockCard
          moduleKey="L2M1"
          title="Applied Prompting Kickoff"
          subtitle="Level 2 begins here. Start using advanced prompt patterns to guide AI more precisely."
          xp={100}
          duration="16 min"
          icon="ðŸš€"
          onStart={() => navigate('/student/module/5')}
        />
      )}

      {!isCompleted('L1M1') && (
        <div className="ui-card" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 28 }}>🌱</div>
          <div style={{ flex: 1 }}>
            <div className="ui-title" style={{ margin: 0 }}>Module 1 · Start Your First AI Mission</div>
            <p className="ui-text">10 min · Beginner · +50 XP · Your first lesson!</p>
          </div>
          <button onClick={() => navigate('/student/module/1')} className="ui-button primary">
            Start →
          </button>
        </div>
      )}
    </div>
  )

  const renderProgressTab = () => (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="ui-title">Learning Progress</h1>
        <p className="ui-text">See how far you've come and what you've achieved.</p>
      </div>

      <section className="dashboard-grid student-progress-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        <div className="ui-card">
          <div className="ui-title">📊 Learning Journey</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {levelRows.map((row, index) => (
              <div key={row.number} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 40px 20px', gap: 10, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-inverse)' }}>Level {row.number}</div>
                  <div className="ui-text" style={{ fontSize: 11 }}>{row.title}</div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${row.percentage}%`,
                    background: row.status === 'completed' ? 'var(--accent-green)' : row.status === 'active' ? 'var(--accent-primary)' : 'var(--bg-soft)',
                    transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${index * 80}ms`,
                  }} />
                </div>
                <div className="ui-text" style={{ fontSize: 11 }}>{row.percentage}%</div>
                <div style={{ fontSize: 14 }}>{row.status === 'completed' ? '✅' : row.status === 'active' ? '▶️' : '🔒'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ui-card">
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['📚', modulesDone, 'Modules'],
              ['🏆', badges.length, 'Badges'],
              ['🔥', streak, 'Streak'],
              ['⚡', xpToday, 'XP Today'],
            ].map(([icon, value, label]) => (
              <div key={label} style={{ padding: 12, borderRadius: 12, background: 'var(--bg-soft)', textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{icon}</div>
                <div className="clash-display" style={{ fontSize: 20, color: 'var(--text-inverse)' }}>{value}</div>
                <div className="ui-text">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="ui-title" style={{ margin: 0 }}>🏆 Your Badges</div>
        </div>
        <div className="dashboard-grid student-badges-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
          {earnedBadgeCards.map(badge => (
            <div key={badge.id} className="ui-card hoverable-card" style={{
              textAlign: 'center', padding: 16,
              opacity: badge.earned ? 1 : 0.4, filter: badge.earned ? 'none' : 'grayscale(1)',
            }}>
              <div style={{ width: 56, height: 56, margin: '0 auto 10px', borderRadius: '50%', padding: 2, background: 'linear-gradient(135deg, #FF5C28, #7B3FE4)', boxShadow: badge.earned ? '0 0 16px rgba(123,63,228,0.4)' : 'none' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {badge.emoji}
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{badge.name}</div>
              <div className="ui-text" style={{ fontSize: 11 }}>{badge.earned ? '✅ Earned' : '🔒 Locked'}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="ui-title">Account Settings</h1>
        <p className="ui-text">Manage your profile and preferences.</p>
      </div>

      <div className="ui-card">
        <div className="ui-title">Personal Information</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Full Name</label>
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-soft)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              {user?.name}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Email Address</label>
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-soft)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              {user?.email}
            </div>
          </div>
        </div>
      </div>

      <div className="ui-card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <div className="ui-title" style={{ color: '#EF4444' }}>Danger Zone</div>
        <p className="ui-text">Logging out will end your current session.</p>
        <button onClick={logout} className="ui-button secondary" style={{ marginTop: 12, color: '#EF4444', borderColor: '#EF4444' }}>
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
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
        {activeTab !== 'today' && <RobOnboardingModal visible={showOnboarding} onComplete={() => setShowOnboarding(false)} />}

        {activeTab === 'today' && <TodayLesson />}
        {activeTab === 'home' && renderHomeTab()}
        {activeTab === 'courses' && renderCoursesTab()}
        {activeTab === 'progress' && renderProgressTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </main>

      {activeTab !== 'today' && <RobFloating currentModuleId={activeCurriculumModule?._id} />}

      <RobLessonModal open={Boolean(activeLesson)} onClose={() => setActiveLesson(null)}>
        {activeLesson && (
          <RobLesson lesson={activeLesson} onComplete={handleLessonComplete} />
        )}
      </RobLessonModal>
    </div>
  )
}
