import { useState } from 'react'
import RobCharacter from '../ROB/RobCharacter'

const QUESTIONS = [
  {
    id: 1,
    question: 'What is AI best used for?',
    options: ['A Toy', 'A Helper', 'A Boss', 'A Shortcut'],
    correct: 1,
    explanation: 'AI is your helper — it supports your thinking but YOU stay in charge!',
    xp: 10,
  },
  {
    id: 2,
    question: 'Which is a better AI prompt?',
    options: [
      'Help me',
      'Do my homework',
      'Explain fractions using pizza for a 12-year-old',
      'Tell me stuff',
    ],
    correct: 2,
    explanation: 'Specific prompts get specific answers. The more detail you give, the better AI helps!',
    xp: 15,
  },
  {
    id: 3,
    question: 'How can AI help with your school day?',
    options: [
      'Do all your homework for you',
      'Replace your teacher',
      'Help plan your schedule and explain hard topics',
      'Play games all day',
    ],
    correct: 2,
    explanation: 'AI helps you think better — not do things for you. It plans, explains, and guides!',
    xp: 10,
  },
  {
    id: 4,
    question: 'What does "Balance study + play + rest" mean in AI planning?',
    options: [
      'Study 24 hours',
      'Only play',
      'Use AI to schedule all three fairly',
      'Ignore rest',
    ],
    correct: 2,
    explanation: 'AI can create balanced schedules — making sure you study, rest and have fun every day!',
    xp: 15,
  },
]

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function QuizCard({ robName, robColor = 'cyan', onScoreUpdate }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [totalXP, setTotalXP] = useState(0)
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState(false)
  const [xpBurst, setXpBurst] = useState(null)

  const q = QUESTIONS[current]

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)

    const correct = idx === q.correct
    if (correct) {
      const earned = q.xp + (streak >= 2 ? 5 : 0)
      setTotalXP(t => t + earned)
      setStreak(s => s + 1)
      setXpBurst(earned)
      setTimeout(() => setXpBurst(null), 1200)
      onScoreUpdate?.({ correct: true, xp: earned })
    } else {
      setStreak(0)
      onScoreUpdate?.({ correct: false, xp: 0 })
    }
  }

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setDone(true)
    }
  }

  const robEmotion = !answered ? 'thinking' : selected === q.correct ? 'celebrating' : 'encouraging'

  return (
    <div style={{
      background: 'linear-gradient(145deg, #1A1A26, #12121A)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 22, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      position: 'relative',
    }}>
      {/* XP Burst */}
      {xpBurst && (
        <div style={{
          position: 'absolute', top: 16, right: 20, zIndex: 20,
          fontSize: 20, fontWeight: 900,
          color: '#FFD700',
          animation: 'xpBurst 1.1s ease forwards',
          pointerEvents: 'none',
        }}>
          +{xpBurst} XP!
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: '18px 20px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 20 }}>🎯</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>
              Quiz with {robName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              Question {current + 1} of {QUESTIONS.length}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {streak >= 2 && (
            <div style={{
              background: 'rgba(255,122,47,0.15)',
              border: '1px solid rgba(255,122,47,0.35)',
              borderRadius: 8, padding: '3px 10px',
              fontSize: 12, fontWeight: 700, color: '#FF7A2F',
            }}>
              🔥 {streak} streak
            </div>
          )}
          <div style={{
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 8, padding: '3px 10px',
            fontSize: 12, fontWeight: 700, color: '#4ADE80',
          }}>
            ⚡ {totalXP} XP
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {done ? (
          /* Done state */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ marginBottom: 16 }}>
              <RobCharacter size="medium" emotion="celebrating" color={robColor} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#FFD700', marginBottom: 4 }}>
              +{totalXP} XP
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>
              Quiz Complete! 🎉
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              You answered {QUESTIONS.filter((_, i) => i < QUESTIONS.length).length} questions.
            </div>
            <div style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: 14, padding: '14px 16px',
              fontSize: 13, color: '#4ADE80',
              lineHeight: 1.6,
            }}>
              🌟 {robName} is proud of you! Now complete the Mission to unlock your badge!
            </div>
          </div>
        ) : (
          <>
            {/* ROB + Question */}
            <div style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              marginBottom: 18,
            }}>
              <div style={{ flexShrink: 0 }}>
                <RobCharacter size="small" emotion={robEmotion} color={robColor} />
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '14px 16px', flex: 1,
              }}>
                <div style={{
                  fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.55,
                }}>
                  {q.question}
                </div>
              </div>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct
                const isSelected = i === selected
                let bg = 'rgba(255,255,255,0.03)'
                let border = 'rgba(255,255,255,0.08)'
                let color = 'var(--text-secondary)'

                if (answered) {
                  if (isCorrect) {
                    bg = 'rgba(34,197,94,0.14)'
                    border = '#22C55E'
                    color = '#4ADE80'
                  } else if (isSelected) {
                    bg = 'rgba(239,68,68,0.14)'
                    border = '#EF4444'
                    color = '#F87171'
                  }
                } else if (isSelected) {
                  border = 'rgba(255,255,255,0.3)'
                  color = 'var(--text-primary)'
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={answered}
                    style={{
                      background: bg,
                      border: `1.5px solid ${border}`,
                      borderRadius: 12, padding: '11px 14px',
                      color, fontWeight: 600, fontSize: 13,
                      cursor: answered ? 'default' : 'pointer',
                      textAlign: 'left', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                    onMouseEnter={e => { if (!answered) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' } }}
                    onMouseLeave={e => { if (!answered) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border } }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, flexShrink: 0,
                    }}>
                      {answered && isCorrect ? '✅' : answered && isSelected && !isCorrect ? '❌' : OPTION_LABELS[i]}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {answered && (
              <div style={{
                background: selected === q.correct ? 'rgba(34,197,94,0.1)' : 'rgba(255,122,47,0.1)',
                border: `1px solid ${selected === q.correct ? 'rgba(34,197,94,0.3)' : 'rgba(255,122,47,0.3)'}`,
                borderRadius: 12, padding: '12px 14px', marginBottom: 14,
                animation: 'slideUpFade 0.3s ease',
              }}>
                <div style={{
                  fontSize: 12, fontWeight: 800,
                  color: selected === q.correct ? '#4ADE80' : '#FF7A2F',
                  marginBottom: 4,
                }}>
                  {selected === q.correct ? '🎉 Correct!' : '💪 Keep going!'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {q.explanation}
                </div>
              </div>
            )}

            {/* Next button */}
            {answered && (
              <button
                onClick={handleNext}
                style={{
                  width: '100%', padding: '12px',
                  background: 'linear-gradient(135deg, #7B3FE4, #5B2DB4)',
                  border: 'none', borderRadius: 12,
                  color: '#fff', fontWeight: 800, fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(123,63,228,0.4)',
                }}
              >
                {current < QUESTIONS.length - 1 ? 'Next Question →' : 'Finish Quiz 🎉'}
              </button>
            )}
          </>
        )}
      </div>

      {/* Progress dots */}
      <div style={{
        padding: '0 20px 16px',
        display: 'flex', gap: 6, justifyContent: 'center',
      }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{
            width: i === current ? 20 : 6, height: 6,
            borderRadius: 99,
            background: i < current ? '#22C55E' : i === current ? '#9B6FF4' : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      <style>{`
        @keyframes xpBurst {
          0% { opacity: 0; transform: translateY(8px) scale(0.8); }
          30% { opacity: 1; transform: translateY(-12px) scale(1.1); }
          70% { opacity: 1; transform: translateY(-18px) scale(1); }
          100% { opacity: 0; transform: translateY(-30px) scale(0.9); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
