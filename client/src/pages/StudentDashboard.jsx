import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import Sidebar from '../components/layout/Sidebar'
import LoadingSkeleton, { SkeletonCard } from '../components/ui/LoadingSkeleton'

// ── Sidebar nav items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home',     icon: '🏠', label: 'Home'         },
  { id: 'courses',  icon: '📚', label: 'My Courses'   },
  { id: 'progress', icon: '📈', label: 'Progress'     },
  { id: 'settings', icon: '⚙️', label: 'Settings'     },
]

// ── Mock data (replace with real API calls later) ────────────────────────────
const MOCK_STATS = [
  { id: 'level',   label: 'Current Level',  value: '3',      sub: 'Intermediate',      icon: '⭐', color: 'var(--accent-purple-light)' },
  { id: 'modules', label: 'Modules Done',   value: '12',     sub: 'of 24 total',       icon: '📖', color: 'var(--accent-blue)'          },
  { id: 'streak',  label: 'Day Streak',     value: '7',      sub: 'Keep it up!',       icon: '🔥', color: 'var(--accent-orange)'        },
  { id: 'time',    label: 'Hours Learned',  value: '18.5',   sub: 'This month',        icon: '⏱', color: 'var(--accent-green)'         },
]

const MOCK_MODULES = [
  { id: 1, title: 'Introduction to Python',     percent: 100, status: 'completed', duration: '45 min' },
  { id: 2, title: 'Variables & Data Types',     percent: 100, status: 'completed', duration: '30 min' },
  { id: 3, title: 'Control Flow & Loops',       percent: 75,  status: 'in-progress', duration: '50 min' },
  { id: 4, title: 'Functions & Scope',          percent: 0,   status: 'locked',    duration: '40 min' },
  { id: 5, title: 'Lists, Tuples & Dicts',      percent: 0,   status: 'locked',    duration: '55 min' },
  { id: 6, title: 'File Handling & Exceptions', percent: 0,   status: 'locked',    duration: '45 min' },
]

const MOCK_ACTIVITY = [
  { date: 'Today',      text: 'Completed "Variables & Data Types"',        icon: '✅' },
  { date: 'Yesterday',  text: 'Watched 3 videos in Control Flow & Loops',  icon: '▶️' },
  { date: '2 days ago', text: 'Completed "Introduction to Python"',        icon: '✅' },
  { date: '4 days ago', text: 'Started "Control Flow & Loops"',            icon: '🚀' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || 'U'
}

function StatusBadge({ status }) {
  if (status === 'completed')   return <span className="badge-green">✓ Done</span>
  if (status === 'in-progress') return <span className="badge-orange">▶ In Progress</span>
  return <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>🔒 Locked</span>
}

// ── Sub-pages ────────────────────────────────────────────────────────────────
function HomeTab({ user, navigate }) {
  const currentModule = MOCK_MODULES.find(m => m.status === 'in-progress') || MOCK_MODULES[0]
  const completedCount = MOCK_MODULES.filter(m => m.status === 'completed').length
  const overallPercent = Math.round((completedCount / MOCK_MODULES.length) * 100)

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
        </h1>
        <p className="page-subtitle">Pick up where you left off and keep the streak alive.</p>
      </div>

      {/* Stat cards */}
      <div
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {MOCK_STATS.map(stat => (
          <div key={stat.id} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{stat.icon}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Continue learning */}
        <div>
          <div className="section-header">
            <span className="section-title">Continue Learning</span>
            <span className="badge-purple">{overallPercent}% complete</span>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-xl)',
            padding: 24,
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(123,63,228,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                flexShrink: 0,
              }}>
                🐍
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--accent-orange)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Current Module
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {currentModule.title}
                </h3>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Progress</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-purple-light)' }}>{currentModule.percent}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${currentModule.percent}%` }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    className="btn-primary"
                    style={{ fontSize: 13, padding: '8px 20px' }}
                    onClick={() => navigate(`/player/${currentModule.id}`)}
                  >
                    ▶ Continue
                  </button>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱ {currentModule.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Course Progress</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{completedCount}/{MOCK_MODULES.length} modules</span>
            </div>
            <div className="progress-bar-track" style={{ height: 8 }}>
              <div className="progress-bar-fill" style={{ width: `${overallPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <div className="section-header">
            <span className="section-title">Recent Activity</span>
          </div>
          <div className="glass-card" style={{ padding: 20 }}>
            {MOCK_ACTIVITY.map((act, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 12,
                paddingBottom: i < MOCK_ACTIVITY.length - 1 ? 16 : 0,
                marginBottom: i < MOCK_ACTIVITY.length - 1 ? 16 : 0,
                borderBottom: i < MOCK_ACTIVITY.length - 1 ? '1px solid var(--border-color)' : 'none',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{act.icon}</span>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{act.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{act.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CoursesTab({ navigate }) {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Courses</h1>
        <p className="page-subtitle">All your enrolled modules in one place.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MOCK_MODULES.map((mod) => (
          <div
            key={mod.id}
            className="glass-card hoverable-card"
            style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}
          >
            {/* Icon */}
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: mod.status === 'locked'
                ? 'var(--bg-card-hover)'
                : 'rgba(123,63,228,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
              border: mod.status === 'in-progress' ? '1px solid var(--border-glow)' : '1px solid var(--border-color)',
            }}>
              {mod.status === 'completed' ? '✅' : mod.status === 'in-progress' ? '▶️' : '🔒'}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: mod.status === 'locked' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {mod.title}
                </span>
                <StatusBadge status={mod.status} />
              </div>
              {mod.status !== 'locked' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="progress-bar-track" style={{ flex: 1, height: 4 }}>
                    <div className="progress-bar-fill" style={{ width: `${mod.percent}%` }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{mod.percent}%</span>
                </div>
              )}
            </div>

            {/* Duration + action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{mod.duration}</span>
              {mod.status !== 'locked' && (
                <button
                  className="btn-primary"
                  style={{ fontSize: 12, padding: '6px 14px' }}
                  onClick={() => navigate(`/player/${mod.id}`)}
                >
                  {mod.status === 'completed' ? 'Review' : 'Continue'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgressTab() {
  const completedCount = MOCK_MODULES.filter(m => m.status === 'completed').length
  const overallPercent = Math.round((completedCount / MOCK_MODULES.length) * 100)

  const weekActivity = [65, 80, 45, 90, 70, 100, 55] // % of daily goal met, Sun-Sat
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Your Progress</h1>
        <p className="page-subtitle">Track your learning journey over time.</p>
      </div>

      {/* Overview cards */}
      <div
        className="stats-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}
      >
        {[
          { label: 'Overall Progress', value: `${overallPercent}%`,    icon: '📊', color: 'var(--accent-purple-light)' },
          { label: 'Modules Completed', value: `${completedCount}`,    icon: '✅', color: 'var(--accent-green)'         },
          { label: 'Current Streak',    value: '7 days',               icon: '🔥', color: 'var(--accent-orange)'        },
          { label: 'Time This Week',    value: '4.5 hrs',              icon: '⏱', color: 'var(--accent-blue)'          },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Week activity */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div className="section-header" style={{ marginBottom: 20 }}>
          <span className="section-title">This Week</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Daily goal: 30 min</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 80 }}>
          {weekActivity.map((pct, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%',
                height: (pct / 100) * 60,
                borderRadius: 4,
                background: pct >= 80
                  ? 'linear-gradient(180deg, var(--accent-purple-light), var(--accent-purple))'
                  : 'var(--bg-card-hover)',
                border: '1px solid var(--border-color)',
                transition: 'height 0.4s ease',
              }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Module-by-module */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="section-title" style={{ marginBottom: 20 }}>Module Breakdown</div>
        {MOCK_MODULES.map((mod, i) => (
          <div key={mod.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingBottom: i < MOCK_MODULES.length - 1 ? 14 : 0,
            marginBottom: i < MOCK_MODULES.length - 1 ? 14 : 0,
            borderBottom: i < MOCK_MODULES.length - 1 ? '1px solid var(--border-color)' : 'none',
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 20, flexShrink: 0, textAlign: 'right' }}>{i + 1}</span>
            <span style={{ flex: 1, fontSize: 13, color: mod.status === 'locked' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
              {mod.title}
            </span>
            <div className="progress-bar-track" style={{ width: 120, height: 5, flexShrink: 0 }}>
              <div className="progress-bar-fill" style={{ width: `${mod.percent}%` }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 36, textAlign: 'right', flexShrink: 0 }}>
              {mod.percent}%
            </span>
            <StatusBadge status={mod.status} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab({ user }) {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences.</p>
      </div>

      <div style={{ maxWidth: 540 }}>
        {/* Profile section */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>Profile</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div className="avatar-circle" style={{ width: 56, height: 56, fontSize: 20 }}>
              {getInitials(user?.name)}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{user?.name || 'Student'}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>+91 {user?.phone || '—'}</div>
              <span className="badge-purple" style={{ marginTop: 6 }}>Student</span>
            </div>
          </div>
          <hr className="divider" />
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <div><strong style={{ color: 'var(--text-primary)', width: 100, display: 'inline-block' }}>User ID</strong> {user?.id || '—'}</div>
            <div><strong style={{ color: 'var(--text-primary)', width: 100, display: 'inline-block' }}>Role</strong> Student</div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>Notifications</div>
          {['Daily learning reminders', 'New content alerts', 'Achievement unlocks'].map((label, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: i < 2 ? 16 : 0,
              marginBottom: i < 2 ? 16 : 0,
              borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none',
            }}>
              <span style={{ fontSize: 14 }}>{label}</span>
              <div style={{
                width: 44,
                height: 24,
                borderRadius: 99,
                background: i === 0 ? 'var(--accent-purple)' : 'var(--bg-card-hover)',
                border: '1px solid var(--border-color)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}>
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 2,
                  left: i === 0 ? 22 : 2,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const { showToast }    = useToast()
  const navigate         = useNavigate()
  const [activeTab, setActiveTab] = useState('home')
  const [pageLoading, setPageLoading] = useState(true)

  // Simulate initial data load
  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  const handleSignOut = () => {
    showToast('Signed out successfully', 'info')
    setTimeout(logout, 500)
  }

  const renderContent = () => {
    if (pageLoading) {
      return (
        <div>
          <LoadingSkeleton height={36} width="40%" borderRadius={10} />
          <div style={{ marginTop: 8, marginBottom: 32 }}>
            <LoadingSkeleton height={18} width="55%" borderRadius={6} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[1,2,3,4].map(i => <SkeletonCard key={i} height={100} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            <SkeletonCard height={220} />
            <SkeletonCard height={220} />
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case 'home':     return <HomeTab user={user} navigate={navigate} />
      case 'courses':  return <CoursesTab navigate={navigate} />
      case 'progress': return <ProgressTab />
      case 'settings': return <SettingsTab user={user} />
      default:         return <HomeTab user={user} navigate={navigate} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar
        items={NAV_ITEMS}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        userName={user?.name || 'Student'}
        userRole={user?.role || 'student'}
        userInitials={getInitials(user?.name)}
        onSignOut={handleSignOut}
      />

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}
