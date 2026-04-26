import { useEffect, useState } from 'react'
import { useROB } from '../../context/RobContext'
import { getROBQuiz } from '../../services/api'
import RobCharacter from './RobCharacter'

export default function RobQuizPanel({ currentModuleId }) {
  const { robName, addXP, recordAnswer } = useROB()
  const displayName = robName || 'ROB'

  const [quiz, setQuiz] = useState(null)
  const [state, setState] = useState({ loading: true, selected: null, checked: false, correct: false })
  const [xpEarned, setXpEarned] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    loadQuiz()
  }, [currentModuleId])

  const loadQuiz = () => {
    setState({ loading: true, selected: null, checked: false, correct: false })
    getROBQuiz(currentModuleId)
      .then(data => {
        setQuiz(data)
        setState({ loading: false, selected: null, checked: false, correct: false })
      })
      .catch(() => {
        setQuiz({ available: false })
        setState({ loading: false, selected: null, checked: false, correct: false })
      })
  }

  const handleAnswer = (index) => {
    if (!quiz?.available || state.checked) return
    const correct = Boolean(quiz.options?.[index]?.isCorrect)
    setState({ loading: false, selected: index, checked: true, correct })
    recordAnswer(correct)
    if (correct) {
      addXP(15)
      setXpEarned(xp => xp + 15)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }
  }

  return (
    <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 380 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div className="clash-display" style={{ fontSize: 18 }}>🎯 Quiz Me</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {streak > 1 && (
            <span style={{ fontSize: 12, background: 'rgba(255,122,47,0.15)', border: '1px solid rgba(255,122,47,0.3)', borderRadius: 999, padding: '4px 10px', color: '#FF7A2F', fontWeight: 700 }}>
              🔥 {streak} streak
            </span>
          )}
          {xpEarned > 0 && (
            <span style={{ fontSize: 12, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 999, padding: '4px 10px', color: '#22C55E', fontWeight: 700 }}>
              +{xpEarned} XP
            </span>
          )}
        </div>
      </div>

      {state.loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RobCharacter size="small" emotion="thinking" speech="Finding a great question..." />
        </div>
      )}

      {!state.loading && !quiz?.available && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center' }}>
          <RobCharacter size="small" emotion="confused" speech="No quiz questions yet!" />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
            Ask your teacher to train {displayName} first 📚
          </p>
        </div>
      )}

      {!state.loading && quiz?.available && (
        <>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 15, lineHeight: 1.6, fontWeight: 600, margin: 0 }}>{quiz.question}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            {(quiz.options || []).map((option, i) => {
              const isSelected = state.selected === i
              const isCorrect = Boolean(option.isCorrect)
              const showGreen = state.checked && isCorrect
              const showRed = state.checked && isSelected && !isCorrect
              return (
                <button
                  key={`${option.text}-${i}`}
                  type="button"
                  onClick={() => handleAnswer(i)}
                  disabled={state.checked || state.loading}
                  style={{
                    width: '100%', textAlign: 'left', padding: '11px 16px', borderRadius: 14,
                    border: `1px solid ${showGreen ? '#22C55E' : showRed ? '#EF4444' : isSelected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    background: showGreen ? 'rgba(34,197,94,0.18)' : showRed ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)', cursor: state.checked ? 'default' : 'pointer',
                    transition: 'all 0.2s', fontSize: 14, fontFamily: 'inherit',
                  }}
                >
                  <span style={{ marginRight: 10, opacity: 0.5, fontWeight: 600 }}>{String.fromCharCode(65 + i)}.</span>
                  {option.text}
                  {showGreen && <span style={{ float: 'right' }}>✅</span>}
                  {showRed && <span style={{ float: 'right' }}>❌</span>}
                </button>
              )
            })}
          </div>

          {state.checked && (
            <div style={{ animation: 'dashboardRise 0.3s ease' }}>
              <div style={{
                padding: '12px 16px', borderRadius: 14, marginBottom: 10,
                background: state.correct ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${state.correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                fontSize: 13, lineHeight: 1.5,
                color: state.correct ? '#4ADE80' : '#F87171',
              }}>
                {state.correct ? '✅ Correct! ' : '❌ Not quite! '}{quiz.explanation}
              </div>
              <button type="button" className="btn-primary" onClick={loadQuiz} style={{ width: '100%' }}>
                Next Question →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
