import { useNavigate } from 'react-router-dom'

const MODULES = [
  {
    id: 1,
    title: 'ROB Saves Your Day with AI',
    status: 'active',
    xp: 50,
    duration: '10 min',
    icon: '🤖',
  },
  {
    id: 2,
    title: 'Better Questions, Better Answers',
    status: 'locked',
    xp: 60,
    duration: '12 min',
    icon: '💬',
  },
  {
    id: 3,
    title: 'ROB Becomes Your Tutor',
    status: 'locked',
    xp: 75,
    duration: '15 min',
    icon: '📚',
  },
  {
    id: 4,
    title: "Catch ROB's Wrong Facts",
    status: 'locked',
    xp: 80,
    duration: '14 min',
    icon: '🔍',
  },
]

export default function ModuleSidebar({
  activeModuleId = 1,
  completedModules = [],
  unlockedModules = ['L1M1'],
  progressPercent = 0,
}) {
  const navigate = useNavigate()

  return (
    <aside style={{
      width: 260,
      flexShrink: 0,
      background: '#0F0B1C',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <button
          onClick={() => navigate('/dashboard/student')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>← Dashboard</span>
        </button>
        <div style={{
          fontWeight: 900, fontSize: 18,
          background: 'linear-gradient(135deg, #9B6FF4, #3B82F6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          UpgrAIed
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          Level 1 · AI Foundations
        </div>
      </div>

      {/* Level Progress */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Level 1 Progress</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#9B6FF4' }}>{progressPercent}%</span>
        </div>
        <div style={{
          height: 6, borderRadius: 99,
          background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 99,
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #7B3FE4, #9B6FF4)',
            boxShadow: '0 0 10px rgba(123,63,228,0.7)',
            transition: 'width 0.8s cubic-bezier(0.34,1.3,0.64,1)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {completedModules.length} of {MODULES.length} modules
          </span>
          <span style={{ fontSize: 10, color: '#FFD700', fontWeight: 700 }}>
            ⚡ {completedModules.length * 50} / 265 XP
          </span>
        </div>
      </div>

      {/* Module List */}
      <div style={{ padding: '12px 12px', flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px 10px' }}>
          Modules
        </div>

        {MODULES.map((mod) => {
          const isActive = mod.id === activeModuleId
          const isDone = completedModules.includes(mod.id)
          const moduleKey = `L1M${mod.id}`
          const isUnlocked = unlockedModules.includes(moduleKey)
          const isLocked = !isUnlocked && !isDone && !isActive

          return (
            <button
              key={mod.id}
              onClick={() => !isLocked && navigate(`/student/module/${mod.id}`)}
              disabled={isLocked}
              style={{
                width: '100%', textAlign: 'left',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(123,63,228,0.18), rgba(155,111,244,0.1))'
                  : isDone
                    ? 'rgba(34,197,94,0.07)'
                    : 'transparent',
                border: `1px solid ${isActive ? 'rgba(123,63,228,0.4)' : isDone ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 12,
                padding: '12px 12px',
                marginBottom: 6,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.45 : 1,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {/* Status icon */}
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: isActive
                    ? 'rgba(123,63,228,0.3)'
                    : isDone
                      ? 'rgba(34,197,94,0.2)'
                      : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>
                  {isDone ? '✅' : isLocked ? '🔒' : mod.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 700, lineHeight: 1.4,
                    color: isActive ? 'var(--text-primary)' : isDone ? '#4ADE80' : 'var(--text-secondary)',
                    marginBottom: 3,
                  }}>
                    {mod.title}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{mod.duration}</span>
                    <span style={{ fontSize: 10, color: '#FFD700', fontWeight: 700 }}>+{mod.xp} XP</span>
                  </div>
                </div>
              </div>

              {isActive && (
                <div style={{
                  marginTop: 8,
                  background: 'rgba(123,63,228,0.15)', borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: 10, fontWeight: 700, color: '#9B6FF4',
                  display: 'inline-block',
                }}>
                  ▶ In Progress
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom badge */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{
          background: 'rgba(255,215,0,0.08)',
          border: '1px solid rgba(255,215,0,0.2)',
          borderRadius: 10, padding: '10px 12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>🏆</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#FFD700' }}>Complete Level 1</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Earn the AI Pioneer badge</div>
        </div>
      </div>
    </aside>
  )
}
