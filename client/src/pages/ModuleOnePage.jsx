import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useROB } from '../context/RobContext'
import { useToast } from '../context/ToastContext'

import ModuleSidebar from '../components/module/ModuleSidebar'
import LessonHero from '../components/module/LessonHero'
import VideoSection from '../components/module/VideoSection'
import QuizCard from '../components/module/QuizCard'
import MissionCard from '../components/module/MissionCard'
import CompletionModal from '../components/progress/CompletionModal'
import { useStudentProgress } from '../context/StudentProgressContext'

function SectionLabel({ step, label, sublabel }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: 'linear-gradient(135deg, #7B3FE4, #5B2DB4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 900, color: '#fff',
        boxShadow: '0 4px 14px rgba(123,63,228,0.4)',
      }}>
        {step}
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', lineHeight: 1.2 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{sublabel}</div>}
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div style={{
      height: 1, background: 'rgba(255,255,255,0.05)',
      margin: '36px 0',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        background: 'var(--bg-primary, #0A0A0F)',
        padding: '0 12px',
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
      </div>
    </div>
  )
}

const UPCOMING_MODULES = [
  {
    key: 'L1M2',
    icon: '💬',
    title: 'Module 2',
    desc: 'Better Questions, Better Answers',
    xp: '+60 XP',
    color: '#9B6FF4',
  },
  {
    key: 'L1M3',
    icon: '📚',
    title: 'Module 3',
    desc: 'ROB Becomes Your Tutor',
    xp: '+75 XP',
    color: '#00D4FF',
  },
  {
    key: 'L1M4',
    icon: '🔍',
    title: 'Module 4',
    desc: "Catch ROB's Wrong Facts",
    xp: '+80 XP',
    color: '#FF7A2F',
  },
]

export default function ModuleOnePage() {
  const navigate = useNavigate()
  const { moduleNumber = '1' } = useParams()
  const { addXP, robColor } = useROB()
  const { showToast } = useToast()
  const {
    completeModule,
    progress,
    isCompleted,
    isUnlocked,
    MODULE_MAP,
  } = useStudentProgress()

  const robName = localStorage.getItem('robName') || 'ROB'
  const moduleIndex = Number(moduleNumber)
  const moduleKey = `L1M${moduleIndex}`
  const moduleMeta = MODULE_MAP[moduleKey]
  const nextModuleKey = moduleMeta?.unlocks || null
  const nextModuleMeta = nextModuleKey ? MODULE_MAP[nextModuleKey] : null

  const [isVideoStarted, setIsVideoStarted] = useState(false)
  const [quizXP, setQuizXP] = useState(0)
  const [missionSubmitted, setMissionSubmitted] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [progressPercent, setProgressPercent] = useState(5)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const completedModuleIds = useMemo(
    () => progress.completedModules
      .map((key) => Number(key.replace('L1M', '')))
      .filter((id) => Number.isFinite(id)),
    [progress.completedModules]
  )

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!moduleMeta) {
      showToast('That module is not available yet.', 'error')
      navigate('/dashboard/student', { replace: true })
      return
    }

    if (!isUnlocked(moduleKey) && !isCompleted(moduleKey)) {
      showToast('This module is still locked. Complete the previous one first.', 'error')
      navigate('/dashboard/student', { replace: true })
    }
  }, [moduleKey, moduleMeta, navigate, isUnlocked, isCompleted, showToast])

  useEffect(() => {
    if (isCompleted(moduleKey)) {
      setMissionSubmitted(true)
      setProgressPercent(100)
    }
  }, [moduleKey, isCompleted])

  useEffect(() => {
    if (isVideoStarted && progressPercent < 60) {
      const t = setInterval(() => setProgressPercent((p) => Math.min(p + 2, 60)), 4000)
      return () => clearInterval(t)
    }
  }, [isVideoStarted, progressPercent])

  const handleVideoStart = () => {
    setIsVideoStarted(true)
    setProgressPercent((p) => Math.max(p, 20))
    showToast('Lesson started! Earn XP as you learn.', 'success')
  }

  const handleAskRob = () => {
    showToast(`${robName} is ready to help! Scroll to the Quick Help panel.`, 'success')
    document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleQuizUpdate = useCallback(({ correct, xp }) => {
    if (correct && xp > 0) {
      setQuizXP((prev) => prev + xp)
      setProgressPercent((p) => Math.min(p + 8, 90))
      showToast(`+${xp} XP! Keep going!`, 'success')
    }
  }, [showToast])

  const handleMissionSubmit = async () => {
    setMissionSubmitted(true)
    setProgressPercent(100)

    if (!isCompleted(moduleKey)) {
      await completeModule(moduleKey)
    }

    try {
      await addXP(moduleMeta?.xp || 50)
    } catch {}

    setTimeout(() => setShowReward(true), 600)
  }

  const handleContinue = () => {
    setShowReward(false)
    if (nextModuleMeta && isUnlocked(nextModuleKey)) {
      navigate(`/student/module/${nextModuleMeta.module}`)
      return
    }
    navigate('/dashboard/student')
  }

  if (!moduleMeta) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #0A0A0F)',
      color: 'var(--text-primary, #F0F0FF)',
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: 'flex',
    }}>
      {!isMobile && (
        <ModuleSidebar
          activeModuleId={moduleIndex}
          completedModules={completedModuleIds}
          unlockedModules={progress.unlockedModules}
          progressPercent={progressPercent}
        />
      )}

      {isMobile && sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            }}
          />
          <div style={{ position: 'fixed', left: 0, top: 0, zIndex: 50 }}>
            <ModuleSidebar
              activeModuleId={moduleIndex}
              completedModules={completedModuleIds}
              unlockedModules={progress.unlockedModules}
              progressPercent={progressPercent}
            />
          </div>
        </>
      )}

      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 260,
        minWidth: 0,
      }}>
        <div style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '0 28px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            minHeight: 60,
          }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '6px 10px',
                  color: 'var(--text-primary)', cursor: 'pointer', fontSize: 16,
                }}
              >
                ☰
              </button>
            )}

            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
              color: '#9B6FF4', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              {`Level ${moduleMeta.level} · Module ${moduleMeta.module}`}
            </div>

            <div style={{
              flex: 1, fontWeight: 800, fontSize: 14,
              color: 'var(--text-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {moduleMeta.title}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ width: 140, display: isMobile ? 'none' : 'block' }}>
                <div style={{
                  height: 6, borderRadius: 99,
                  background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(90deg, #7B3FE4, #9B6FF4)',
                    boxShadow: '0 0 8px rgba(123,63,228,0.6)',
                    transition: 'width 0.8s ease',
                  }} />
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#9B6FF4', whiteSpace: 'nowrap' }}>
                {progressPercent}%
              </span>
            </div>

            <div style={{
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.25)',
              borderRadius: 8, padding: '4px 12px',
              fontSize: 11, fontWeight: 700, color: '#FFD700', whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {`⚡ ${quizXP + (missionSubmitted ? (moduleMeta.xp || 50) : 0)} XP`}
            </div>
          </div>
        </div>

        <div style={{ padding: isMobile ? '24px 16px 60px' : '36px 36px 72px', maxWidth: 1100 }}>
          <LessonHero
            robName={robName}
            robColor={robColor || 'cyan'}
            xpReward={moduleMeta.xp || 50}
            onStartLesson={handleVideoStart}
            onAskRob={handleAskRob}
          />

          <Divider />

          <div id="video-section">
            <SectionLabel
              step="1"
              label="Watch the Lesson"
              sublabel="8-10 min · See how AI can transform your daily routine"
            />
            <VideoSection
              robName={robName}
              robColor={robColor || 'cyan'}
              isVideoStarted={isVideoStarted}
              onVideoStart={handleVideoStart}
            />
          </div>

          <Divider />

          <div>
            <SectionLabel
              step="2"
              label="Test Your Knowledge & Complete the Mission"
              sublabel="Answer questions and submit your AI-powered day plan"
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 20,
              alignItems: 'start',
            }}>
              <QuizCard
                robName={robName}
                robColor={robColor || 'cyan'}
                onScoreUpdate={handleQuizUpdate}
              />
              <MissionCard
                robName={robName}
                robColor={robColor || 'cyan'}
                submitted={missionSubmitted}
                onSubmit={handleMissionSubmit}
              />
            </div>
          </div>

          <Divider />

          <div>
            <SectionLabel
              step="3"
              label="What's Next?"
              sublabel="Keep building your AI superpowers"
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: 16,
            }}>
              {UPCOMING_MODULES.map((mod) => {
                const unlocked = isUnlocked(mod.key) || isCompleted(mod.key)
                const targetMeta = MODULE_MAP[mod.key]

                return (
                  <div key={mod.key} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16, padding: '20px',
                    opacity: unlocked ? 1 : 0.6, position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{mod.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: mod.color, marginBottom: 4 }}>{mod.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{mod.desc}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#FFD700' }}>{mod.xp}</span>
                      <button
                        type="button"
                        disabled={!unlocked}
                        onClick={() => navigate(`/student/module/${targetMeta.module}`)}
                        style={{
                          background: unlocked ? 'rgba(34,197,94,0.16)' : 'rgba(255,255,255,0.07)',
                          border: `1px solid ${unlocked ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: 6, padding: '3px 8px',
                          fontSize: 11, fontWeight: 600,
                          color: unlocked ? '#4ADE80' : 'var(--text-muted)',
                          cursor: unlocked ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {isCompleted(mod.key) ? 'Completed' : unlocked ? 'Unlocked' : 'Locked'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {missionSubmitted && (
              <div style={{
                marginTop: 24,
                background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(74,222,128,0.05))',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: 20, padding: '24px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 16,
                animation: 'fadeInUp 0.5s ease',
              }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 18, color: '#4ADE80', marginBottom: 4 }}>
                    {`Level ${moduleMeta.level} · Module ${moduleMeta.module} Complete!`}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {`You've earned the ${moduleMeta.badge} badge and ${quizXP + (moduleMeta.xp || 50)} XP total!`}
                  </div>
                </div>
                <button
                  onClick={() => setShowReward(true)}
                  style={{
                    background: 'linear-gradient(135deg, #22C55E, #15803D)',
                    border: 'none', borderRadius: 14, padding: '12px 24px',
                    color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
                  }}
                >
                  Claim Reward
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showReward && (
        <CompletionModal
          xpEarned={quizXP + (moduleMeta.xp || 50)}
          totalXP={progress.totalXP}
          badgeName={moduleMeta.badge}
          badgeEmoji={moduleMeta.badgeEmoji}
          streakDays={progress.streakDays}
          robName={robName}
          robColor={robColor || 'cyan'}
          nextModuleTitle={nextModuleMeta?.title || 'Keep going'}
          onContinue={handleContinue}
          onDashboard={() => navigate('/dashboard/student')}
        />
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
