import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useROB } from '../context/RobContext'
import { useToast } from '../context/ToastContext'
import RobCharacter from '../components/ROB/RobCharacter'
import RobQuizPanel from '../components/ROB/RobQuizPanel'

// ── Lesson data ────────────────────────────────────────────────────────────────
const LESSON = {
  id: 'mod1-lesson1',
  title: 'What is Artificial Intelligence?',
  module: 'Module 1 · The AI Revolution',
  duration: '18 min',
  xpReward: 150,
  videoSrc: '',          // replace with real src or leave blank for placeholder
  steps: 5,
  quiz: {
    question: 'Which of the following best describes Artificial Intelligence?',
    options: [
      'A robot that looks like a human',
      'Software that simulates human intelligence to perform tasks',
      'A very fast computer',
      'A program that always follows fixed rules',
    ],
    correct: 1,
    explanation: 'AI is software (or systems) that mimics human-like reasoning, learning, and problem-solving.',
  },
  missionTask: {
    prompt: 'In 2–3 sentences, describe one way AI already helps you in daily life. Be specific!',
    placeholder: 'e.g., Spotify recommends songs I haven\'t heard by analysing my listening history and comparing it to millions of users...',
    minLength: 50,
  },
}

// ── XP Popup ─────────────────────────────────────────────────────────────────
function XpPopup({ xp, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(onClose, 4200)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)',
      opacity: visible ? 1 : 0, transition: 'opacity 0.3s',
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #1A1A26, #12121A)',
        border: '1px solid rgba(123,63,228,0.5)',
        borderRadius: 28,
        padding: '48px 56px',
        textAlign: 'center',
        boxShadow: '0 0 80px rgba(123,63,228,0.35), 0 24px 60px rgba(0,0,0,0.6)',
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(32px)',
        transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
        maxWidth: 360,
        width: '90vw',
      }}>
        {/* Stars burst */}
        <div style={{ fontSize: 48, marginBottom: 8, lineHeight: 1 }}>🏆</div>

        <div style={{
          fontSize: 13, fontWeight: 700, letterSpacing: 3,
          color: 'var(--accent-purple-light, #9B6FF4)',
          textTransform: 'uppercase', marginBottom: 12,
        }}>Lesson Complete!</div>

        <div style={{
          fontSize: 72, fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, #FFD700, #FF7A2F)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 4,
        }}>+{xp}</div>

        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
          XP Earned!
        </div>

        <div style={{ marginBottom: 28 }}>
          <RobCharacter size="small" emotion="celebrating" color="purple" showSpeech
            speechText="Incredible work! You're unstoppable! 🚀" />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, var(--accent-purple, #7B3FE4), #5B2DB4)',
              border: 'none', borderRadius: 12, padding: '12px 28px',
              color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(123,63,228,0.45)',
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ value, max, label }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-purple-light, #9B6FF4)' }}>{pct}%</span>
      </div>
      <div style={{
        height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 99,
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--accent-purple, #7B3FE4), #9B6FF4)',
          transition: 'width 0.6s cubic-bezier(0.34,1.3,0.64,1)',
          boxShadow: '0 0 10px rgba(123,63,228,0.6)',
        }} />
      </div>
    </div>
  )
}

// ── Video Placeholder ─────────────────────────────────────────────────────────
function VideoArea({ src }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)

  const toggle = () => {
    if (!src) return
    if (playing) { videoRef.current?.pause(); setPlaying(false) }
    else { videoRef.current?.play(); setPlaying(true) }
  }

  return (
    <div style={{
      position: 'relative', width: '100%', paddingBottom: '56.25%',
      background: 'linear-gradient(145deg, #0D0D18, #12121A)',
      borderRadius: 16, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      {src ? (
        <video ref={videoRef} src={src} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        }} />
      ) : (
        /* Placeholder with gradient scene */
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(145deg, #0D0B1C 0%, #1A1030 50%, #0D1225 100%)',
        }}>
          {/* Glow orbs */}
          <div style={{
            position: 'absolute', width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,63,228,0.18) 0%, transparent 70%)',
            top: '10%', left: '5%',
          }} />
          <div style={{
            position: 'absolute', width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
            bottom: '5%', right: '8%',
          }} />

          <RobCharacter size="medium" emotion="teaching" color="cyan" />
          <div style={{
            marginTop: 20, fontSize: 16, fontWeight: 700,
            color: 'var(--text-primary)', textAlign: 'center',
          }}>
            {LESSON.title}
          </div>
          <div style={{
            marginTop: 6, fontSize: 13, color: 'var(--text-secondary)',
            textAlign: 'center',
          }}>
            🎬 {LESSON.duration} · Click play to begin
          </div>
        </div>
      )}

      {/* Play button overlay */}
      <button
        onClick={toggle}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {!playing && (
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(123,63,228,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 32px rgba(123,63,228,0.6)',
            transition: 'transform 0.2s',
          }}>
            <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
              <path d="M2 2L20 12L2 22V2Z" fill="white" />
            </svg>
          </div>
        )}
      </button>

      {/* Duration badge */}
      <div style={{
        position: 'absolute', bottom: 12, right: 12,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
        borderRadius: 8, padding: '4px 10px',
        fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
      }}>
        {LESSON.duration}
      </div>
    </div>
  )
}

// ── ROB Side Panel ────────────────────────────────────────────────────────────
function RobSidePanel({ lessonId, quizCompleted, onQuizComplete }) {
  const [tab, setTab] = useState('hint')
  const { robName, robColor } = useROB()

  const hints = [
    '💡 AI stands for Artificial Intelligence — machines designed to think!',
    '🧠 Machine Learning is a type of AI that learns from data patterns.',
    '🌍 AI powers search engines, recommendations, voice assistants & more.',
    '⚡ Deep Learning uses neural networks inspired by the human brain.',
  ]
  const [hintIdx, setHintIdx] = useState(0)

  const tabs = [
    { id: 'hint', label: '💡 Hints' },
    { id: 'quiz', label: '🎯 Quiz' },
  ]

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0F0B1C, #12121A)',
      border: '1px solid rgba(0,212,255,0.22)',
      borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
      display: 'flex', flexDirection: 'column',
      minHeight: 420,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <RobCharacter size="small" emotion={tab === 'quiz' ? 'thinking' : 'encouraging'} color={robColor || 'cyan'} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
            {robName || 'ROB'} Helper
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Your AI study buddy</div>
        </div>
        {quizCompleted && (
          <div style={{
            marginLeft: 'auto',
            background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)',
            borderRadius: 8, padding: '3px 10px',
            fontSize: 11, fontWeight: 700, color: '#4ADE80',
          }}>✓ Quiz Done</div>
        )}
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 6, padding: '12px 16px 0',
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? 'rgba(0,212,255,0.14)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${tab === t.id ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 10, padding: '8px 4px',
            color: tab === t.id ? '#00D4FF' : 'var(--text-secondary)',
            fontWeight: 600, fontSize: 12, cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        {tab === 'hint' && (
          <div>
            <div style={{
              background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 14, padding: '16px',
              marginBottom: 14,
            }}>
              <div style={{
                fontSize: 14, lineHeight: 1.65,
                color: 'var(--text-primary)',
              }}>
                {hints[hintIdx]}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setHintIdx(i => Math.max(0, i - 1))}
                disabled={hintIdx === 0}
                style={{
                  flex: 1, padding: '8px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: hintIdx === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: hintIdx === 0 ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 600,
                }}
              >← Prev</button>
              <button
                onClick={() => setHintIdx(i => Math.min(hints.length - 1, i + 1))}
                disabled={hintIdx === hints.length - 1}
                style={{
                  flex: 1, padding: '8px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: hintIdx === hints.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: hintIdx === hints.length - 1 ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 600,
                }}
              >Next →</button>
            </div>

            <div style={{
              marginTop: 14, display: 'flex', gap: 6, justifyContent: 'center',
            }}>
              {hints.map((_, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: i === hintIdx ? '#00D4FF' : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.2s',
                }} />
              ))}
            </div>

            <div style={{
              marginTop: 16, padding: '12px 14px',
              background: 'rgba(123,63,228,0.08)',
              border: '1px solid rgba(123,63,228,0.2)', borderRadius: 12,
              fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
            }}>
              🎯 <strong style={{ color: 'var(--text-primary)' }}>Pro tip:</strong> After watching the video, switch to the Quiz tab to test yourself and earn XP!
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <RobQuizPanel currentModuleId={lessonId} />
        )}
      </div>
    </div>
  )
}

// ── Mission Submit ────────────────────────────────────────────────────────────
function MissionTask({ onSubmit, submitted }) {
  const [answer, setAnswer] = useState('')
  const [focused, setFocused] = useState(false)
  const minLen = LESSON.missionTask.minLength
  const ready = answer.trim().length >= minLen

  return (
    <div style={{
      background: 'linear-gradient(145deg, #1A1A26, #12121A)',
      border: '1px solid rgba(255,122,47,0.25)',
      borderRadius: 20, padding: '28px 28px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, #FF7A2F, #C2410C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
          boxShadow: '0 4px 16px rgba(255,122,47,0.35)',
        }}>🚀</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>
            Mission Task
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            Complete to earn +{LESSON.xpReward} XP · Module 1
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <div style={{
            background: 'rgba(255,122,47,0.12)',
            border: '1px solid rgba(255,122,47,0.3)',
            borderRadius: 8, padding: '4px 12px',
            fontSize: 12, fontWeight: 700, color: '#FF7A2F',
          }}>
            +{LESSON.xpReward} XP
          </div>
        </div>
      </div>

      <div style={{
        fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)',
        marginBottom: 16, fontWeight: 500,
      }}>
        {LESSON.missionTask.prompt}
      </div>

      {submitted ? (
        <div style={{
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.35)',
          borderRadius: 14, padding: '20px 20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
          <div style={{ fontWeight: 700, color: '#4ADE80', fontSize: 15 }}>Mission Submitted!</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Great thinking! Your response has been saved.
          </div>
        </div>
      ) : (
        <>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={LESSON.missionTask.placeholder}
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${focused ? 'rgba(255,122,47,0.5)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12, padding: '14px 16px',
              color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.65,
              resize: 'vertical', outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
          />

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 12,
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {answer.trim().length} / {minLen} chars minimum
              {ready && <span style={{ color: '#4ADE80', marginLeft: 6 }}>✓ Ready!</span>}
            </div>
            <button
              onClick={() => ready && onSubmit(answer)}
              disabled={!ready}
              style={{
                background: ready
                  ? 'linear-gradient(135deg, #FF7A2F, #C2410C)'
                  : 'rgba(255,255,255,0.07)',
                border: 'none', borderRadius: 12,
                padding: '11px 28px',
                color: ready ? '#fff' : 'var(--text-muted)',
                fontWeight: 700, fontSize: 14,
                cursor: ready ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: ready ? '0 4px 20px rgba(255,122,47,0.4)' : 'none',
              }}
            >
              Submit Mission 🚀
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LessonPage() {
  const navigate = useNavigate()
  const { lessonId = LESSON.id } = useParams()
  const { addXP, robLevel } = useROB()
  const { showToast } = useToast()

  const [progress, setProgress] = useState(0)  // 0–LESSON.steps
  const [quizDone, setQuizDone] = useState(false)
  const [missionDone, setMissionDone] = useState(false)
  const [showXpPopup, setShowXpPopup] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Simulate video progress ticking while on page
  useEffect(() => {
    if (progress >= LESSON.steps) return
    const t = setInterval(() => {
      setProgress(p => Math.min(p + 1, LESSON.steps))
    }, 6000)
    return () => clearInterval(t)
  }, [progress])

  const handleMissionSubmit = async (answer) => {
    setMissionDone(true)
    if (!completed) {
      setCompleted(true)
      try { await addXP(LESSON.xpReward) } catch {}
      setShowXpPopup(true)
      showToast(`+${LESSON.xpReward} XP earned! Amazing work! 🎉`, 'success')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #0A0A0F)',
      color: 'var(--text-primary, #F0F0FF)',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: 20,
          minHeight: 64,
        }}>
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 10px', borderRadius: 8,
            }}
          >
            ← Back
          </button>

          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />

          {/* Module badge */}
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
            color: 'var(--accent-purple-light, #9B6FF4)',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            {LESSON.module}
          </div>

          {/* Title */}
          <div style={{
            flex: 1, fontWeight: 800, fontSize: 15,
            color: 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {LESSON.title}
          </div>

          {/* Progress bar area */}
          <div style={{ width: 220, flexShrink: 0 }}>
            <ProgressBar
              value={progress}
              max={LESSON.steps}
              label={`Step ${progress} of ${LESSON.steps}`}
            />
          </div>

          {/* XP badge */}
          <div style={{
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.25)',
            borderRadius: 8, padding: '4px 12px',
            fontSize: 12, fontWeight: 700, color: '#FFD700',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            ⚡ +{LESSON.xpReward} XP
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* ── Two-column: video | ROB panel ─────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.65fr) minmax(0, 1fr)',
          gap: 24,
          alignItems: 'start',
        }}>
          {/* LEFT: video */}
          <div>
            <VideoArea src={LESSON.videoSrc} />

            {/* Lesson info strip */}
            <div style={{
              marginTop: 16, display: 'flex', alignItems: 'center', gap: 16,
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, var(--accent-purple, #7B3FE4), #5B2DB4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>{LESSON.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>
                    {LESSON.module}
                  </div>
                </div>
              </div>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { icon: '⏱', text: LESSON.duration },
                  { icon: '📚', text: 'Beginner' },
                  { icon: '🏅', text: `Level ${robLevel}` },
                ].map(badge => (
                  <div key={badge.text} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8, padding: '5px 12px',
                    fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    {badge.icon} {badge.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Key concepts */}
            <div style={{
              marginTop: 20, background: 'var(--bg-card, #1A1A26)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '20px 24px',
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: 'var(--text-primary)' }}>
                📌 Key Concepts in This Lesson
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 10,
              }}>
                {[
                  { icon: '🧠', term: 'Artificial Intelligence', desc: 'Machines that simulate human thinking' },
                  { icon: '📈', term: 'Machine Learning', desc: 'Systems that learn from data' },
                  { icon: '🕸️', term: 'Neural Networks', desc: 'Brain-inspired computing models' },
                  { icon: '🌐', term: 'AI Applications', desc: 'Real-world use cases today' },
                ].map(c => (
                  <div key={c.term} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, padding: '12px 14px',
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{c.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{c.term}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: ROB helper + quiz */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <RobSidePanel
              lessonId={lessonId}
              quizCompleted={quizDone}
              onQuizComplete={() => setQuizDone(true)}
            />

            {/* Quick stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            }}>
              {[
                { label: 'Progress', value: `${Math.round((progress / LESSON.steps) * 100)}%`, icon: '📊', color: '#7B3FE4' },
                { label: 'XP Reward', value: `+${LESSON.xpReward}`, icon: '⚡', color: '#FFD700' },
                { label: 'Difficulty', value: 'Beginner', icon: '🌱', color: '#22C55E' },
                { label: 'Duration', value: LESSON.duration, icon: '⏱', color: '#3B82F6' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--bg-card, #1A1A26)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, padding: '14px 16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom: Mission task ───────────────────────────────── */}
        <div style={{ marginTop: 32 }}>
          <MissionTask onSubmit={handleMissionSubmit} submitted={missionDone} />
        </div>
      </div>

      {/* ── XP Popup ─────────────────────────────────────────────── */}
      {showXpPopup && (
        <XpPopup
          xp={LESSON.xpReward}
          onClose={() => {
            setShowXpPopup(false)
            navigate('/dashboard/student')
          }}
        />
      )}

      {/* ── Responsive styles ─────────────────────────────────────── */}
      <style>{`
        @media (max-width: 900px) {
          .lesson-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .lesson-topbar-title { display: none !important; }
          .lesson-topbar-progress { width: 120px !important; }
        }
      `}</style>
    </div>
  )
}
