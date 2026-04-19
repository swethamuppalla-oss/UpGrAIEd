import { useMemo, useState } from 'react'
import RobCharacter from './RobCharacter'

const stages = ['hook', 'problem', 'activation', 'challenge', 'feedback', 'concept', 'reward']

export default function RobLesson({ lesson, onComplete }) {
  const [stageIndex, setStageIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)

  const isCorrect = selectedIndex === lesson.correct
  const stage = stages[stageIndex]
  const progress = ((stageIndex + 1) / stages.length) * 100

  const stageContent = useMemo(() => {
    if (stage === 'hook') {
      return {
        emotion: 'happy',
        speech: lesson.hook,
        title: lesson.title,
        body: 'ROB is warming up for a quick lesson. Tap continue when you are ready to teach.',
      }
    }
    if (stage === 'problem') {
      return {
        emotion: 'wrong',
        speech: lesson.problem,
        title: 'ROB Needs Help',
        body: 'Something is off. Let us fix ROBs understanding before he teaches anyone the wrong thing.',
      }
    }
    if (stage === 'activation') {
      return {
        emotion: 'thinking',
        speech: lesson.activation,
        title: 'Your Turn',
        body: 'Pick the answer that would make ROB a little smarter.',
      }
    }
    if (stage === 'feedback') {
      return {
        emotion: isCorrect ? 'excited' : 'error',
        speech: isCorrect ? 'Correct! ROB is leveling up.' : 'Almost. Let me show you the idea.',
        title: isCorrect ? 'Nice Work' : 'Good Catch',
        body: lesson.explanation,
      }
    }
    if (stage === 'concept') {
      return {
        emotion: 'learning',
        speech: 'Saving this to my brain now.',
        title: 'Key Concept',
        body: lesson.concept,
      }
    }
    if (stage === 'reward') {
      return {
        emotion: 'excited',
        speech: `+${lesson.xpReward} XP unlocked!`,
        title: 'Mission Complete',
        body: `ROB learned ${lesson.title} and earned the ${lesson.badgeEmoji} badge.`,
      }
    }
    return null
  }, [isCorrect, lesson, stage])

  const next = () => setStageIndex(prev => Math.min(prev + 1, stages.length - 1))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', minHeight: 620 }}>
      <style>{`
        @keyframes robLessonReveal {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          padding: '32px 36px',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          background: 'radial-gradient(circle at top left, rgba(0,212,255,0.16), transparent 42%), #0f0b1c',
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 10 }}>
            ROB Lesson
          </div>
          <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: 999,
                background: 'linear-gradient(90deg, #FF5C28, #7B3FE4, #00D4FF)',
                transition: 'width 0.35s ease',
              }}
            />
          </div>
        </div>

        <div style={{ animation: 'robLessonReveal 0.28s ease' }}>
          <h2 className="clash-display" style={{ fontSize: 32, marginBottom: 8 }}>
            {stageContent.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            {stageContent.body}
          </p>

          {stage === 'challenge' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="clash-display" style={{ fontSize: 24, marginBottom: 8 }}>
                {lesson.question}
              </div>
              {lesson.options.map((option, index) => {
                const answered = selectedIndex !== null
                const isAnswer = answered && index === lesson.correct
                const isChosen = selectedIndex === index
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    disabled={answered}
                    style={{
                      textAlign: 'left',
                      padding: '16px 18px',
                      borderRadius: 16,
                      border: `1px solid ${isAnswer ? 'rgba(34,197,94,0.6)' : isChosen ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.08)'}`,
                      background: isAnswer
                        ? 'rgba(34,197,94,0.14)'
                        : isChosen
                        ? 'rgba(239,68,68,0.14)'
                        : 'rgba(255,255,255,0.03)',
                      color: 'var(--text-primary)',
                      cursor: answered ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          ) : (
            <div
              style={{
                padding: 22,
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--text-primary)',
                lineHeight: 1.7,
              }}
            >
              {stage === 'reward'
                ? `${lesson.badgeEmoji} Badge unlocked`
                : stageContent.body}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
            {stage !== 'challenge' && stage !== 'reward' && (
              <button type="button" className="btn-primary" onClick={next}>
                Continue
              </button>
            )}
            {stage === 'challenge' && (
              <button
                type="button"
                className="btn-primary"
                onClick={next}
                disabled={selectedIndex === null}
              >
                Check Answer
              </button>
            )}
            {stage === 'feedback' && (
              <button type="button" className="btn-primary" onClick={next}>
                Learn The Concept
              </button>
            )}
            {stage === 'concept' && (
              <button type="button" className="btn-primary" onClick={next}>
                Claim Reward
              </button>
            )}
            {stage === 'reward' && (
              <button type="button" className="btn-primary" onClick={() => onComplete(lesson, isCorrect)}>
                Back To Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at top, rgba(123,63,228,0.2), transparent 38%), rgba(255,255,255,0.02)',
        }}
      >
        <RobCharacter
          size="large"
          emotion={stageContent.emotion}
          speech={stageContent.speech}
          chestProgress={progress}
        />
        <div style={{ marginTop: 22, textAlign: 'center', color: 'var(--text-secondary)', maxWidth: 260 }}>
          Stage {stageIndex + 1} of {stages.length}
        </div>
      </div>
    </div>
  )
}
