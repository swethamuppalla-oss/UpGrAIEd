import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import Sidebar from '../components/layout/Sidebar'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { getStudentProgress, getStudentStats, getStudentLevels } from '../services/api'

const NAV_ITEMS = [
  { id: 'home',     icon: '🏠', label: 'Home'         },
  { id: 'courses',  icon: '📚', label: 'My Courses'   },
  { id: 'progress', icon: '📈', label: 'Progress'     },
  { id: 'settings', icon: '⚙️', label: 'Settings'     },
]

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'U'
}

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const { showToast }    = useToast()
  const navigate         = useNavigate()
  const [activeTab, setActiveTab] = useState('home')
  
  const [progressData, setProgressData] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [levelsData, setLevelsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [prog, stat, lev] = await Promise.all([
          getStudentProgress().catch(() => null),
          getStudentStats().catch(() => ({ level: 1, modules: 0, streak: 0, time: 0 })),
          getStudentLevels().catch(() => [])
        ])
        setProgressData(prog)
        setStatsData(stat)
        setLevelsData(lev)
      } catch (err) {
        showToast('Error loading dashboard data', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [showToast])

  const handleSignOut = () => {
    logout()
  }

  const handleLevelClick = (level) => {
    if (level.status === 'locked') {
      showToast('This level is locked!', 'error')
    } else if (level.status === 'active') {
      navigate('/player')
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
        <div className="page-header">
          <h1 className="page-title">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="page-subtitle">Pick up where you left off and keep the streak alive.</p>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 16, marginBottom: 32
        }}>
          {loading ? (
            <>
              <LoadingSkeleton height="120px" borderRadius="12px" />
              <LoadingSkeleton height="120px" borderRadius="12px" />
              <LoadingSkeleton height="120px" borderRadius="12px" />
              <LoadingSkeleton height="120px" borderRadius="12px" />
            </>
          ) : (
            <>
              <div className="stat-card">
                <div style={{ fontSize: 24, marginBottom: 8 }}>⭐</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-purple-light)' }}>{statsData?.level || 1}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current Level</div>
              </div>
              <div className="stat-card">
                <div style={{ fontSize: 24, marginBottom: 8 }}>📖</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-blue)' }}>{statsData?.modules || 0}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Modules Done</div>
              </div>
              <div className="stat-card">
                <div style={{ fontSize: 24, marginBottom: 8 }}>🔥</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-orange)' }}>{statsData?.streak || 0}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Day Streak</div>
              </div>
              <div className="stat-card">
                <div style={{ fontSize: 24, marginBottom: 8 }}>⏱</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-green)' }}>{statsData?.time || 0}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Hours Learned</div>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Main Left Column */}
          <div>
            <div className="section-header">
              <span className="section-title">Continue Learning</span>
            </div>
            
            {loading ? (
              <LoadingSkeleton height="160px" borderRadius="20px" />
            ) : progressData ? (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glow)',
                borderRadius: 'var(--radius-xl)',
                padding: 24, marginBottom: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--accent-orange)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                      Current Module
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                      {progressData.moduleName || 'Next Module'}
                    </h3>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Progress</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-purple-light)' }}>{progressData.percent || 0}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${progressData.percent || 0}%` }} />
                      </div>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => navigate('/player')}
                    >
                      ▶ Resume
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                No active modules found. Start exploring!
              </div>
            )}

            <div className="section-header" style={{ marginTop: 32 }}>
              <span className="section-title">Level Path</span>
            </div>
            {loading ? (
               <LoadingSkeleton height="100px" borderRadius="12px" />
            ) : levelsData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {levelsData.map((lvl, i) => {
                  const isCompleted = lvl.status === 'completed'
                  const isActive = lvl.status === 'active'
                  const isLocked = lvl.status === 'locked'

                  return (
                    <div 
                      key={lvl.id || i}
                      onClick={() => handleLevelClick(lvl)}
                      className="glass-card hoverable-card"
                      style={{
                        padding: '16px 20px',
                        display: 'flex', alignItems: 'center', gap: 16,
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        opacity: isLocked ? 0.5 : 1,
                        border: isCompleted ? '1px solid var(--accent-green)' 
                               : isActive ? '1px solid var(--accent-purple-light)' 
                               : '1px solid var(--border-color)',
                        boxShadow: isActive ? '0 0 15px rgba(123,63,228,0.2)' : 'none'
                      }}>
                      <div style={{ fontSize: 24 }}>
                        {isCompleted ? '✅' : isActive ? '▶️' : '🔒'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>{lvl.name}</h4>
                      </div>
                      {isCompleted && <span className="badge-green">Completed</span>}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                No levels data available
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="section-header">
              <span className="section-title">Overview</span>
            </div>
            <div className="glass-card" style={{ padding: 20 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                Stay consistent and you'll reach your next milestone soon.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
