import { useEffect, useState } from 'react'
import { useROB } from '../../context/RobContext'
import { getROBQuiz } from '../../services/api'
import RobCharacter from './RobCharacter'

export default function RobQuickRecap({ visible, onClose, moduleId }) {
  const { recordAnswer, setRobName } = useROB() // Note: setRobName is imported just to access context, we don't change names here
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!visible) return
    setLoading(true)
    setFinished(false)
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setChecked(false)

    // Fetch up to 3 questions. Since getROBQuiz only returns 1 right now,
    // we'll simulate fetching 3 by hitting it 3 times (in a real app, backend would return a batch)
    Promise.all([
      getROBQuiz(moduleId),
      getROBQuiz(moduleId),
      getROBQuiz(moduleId),
    ])
      .then(results => {
        // Filter out duplicates and non-available
        const valid = results.filter(r => r && r.available)
        const unique = []
        valid.forEach(q => {
          if (!unique.find(u => u.question === q.question)) unique.push(q)
        })
        setQuestions(unique.slice(0, 3))
        setLoading(false)
      })
      .catch(() => {
        setQuestions([])
        setLoading(false)
      })
  }, [visible, moduleId])

  if (!visible) return null

  const handleAnswer = (index) => {
    if (checked) return
    setSelected(index)
    setChecked(true)
    const q = questions[currentIndex]
    const isCorrect = Boolean(q.options[index]?.isCorrect)
    if (isCorrect) setScore(s => s + 1)
    recordAnswer(isCorrect)
    // If wrong, you might dispatch a "weak topic" API call here
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1)
      setSelected(null)
      setChecked(false)
    } else {
      setFinished(true)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <RobCharacter size="large" emotion="thinking" speech="Fetching your recap module..." />
        </div>
      )
    }

    if (questions.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <RobCharacter size="large" emotion="confused" speech="No questions found for this module!" />
          <button className="btn-primary" onClick={onClose} style={{ mt: 24 }}>Close</button>
        </div>
      )
    }

    if (finished) {
      const allCorrect = score === questions.length
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <RobCharacter 
            size="hero" 
            emotion={allCorrect ? 'celebrating' : 'happy'} 
            speech={`Recap complete! You got ${score} out of ${questions.length} correct.`} 
          />
          <div className="clash-display" style={{ fontSize: 32, color: allCorrect ? '#22C55E' : 'white' }}>
            +{score * 15} XP Earned
          </div>
          <button className="btn-primary" onClick={onClose} style={{ width: 200, padding: 16 }}>
            Continue Mission →
          </button>
        </div>
      )
    }

    const q = questions[currentIndex]
    const isCorrect = checked && selected !== null ? Boolean(q.options[selected]?.isCorrect) : null

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 40, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, color: 'var(--text-secondary)' }}>
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>

          <h2 style={{ fontSize: 28, marginBottom: 32, lineHeight: 1.4 }}>{q.question}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {q.options.map((opt, idx) => {
              const isSelected = selected === idx
              const optCorrect = Boolean(opt.isCorrect)
              const showGreen = checked && optCorrect
              const showRed = checked && isSelected && !optCorrect
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={checked}
                  style={{
                    background: showGreen ? 'rgba(34,197,94,0.15)' : showRed ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${showGreen ? '#22C55E' : showRed ? '#EF4444' : isSelected ? 'white' : 'rgba(255,255,255,0.1)'}`,
                    padding: '20px 24px',
                    borderRadius: 16,
                    textAlign: 'left',
                    fontSize: 18,
                    cursor: checked ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    color: 'white',
                    display: 'flex', justifyContent: 'space-between'
                  }}
                >
                  <span>{opt.text}</span>
                  {showGreen && <span>✅</span>}
                  {showRed && <span>❌</span>}
                </button>
              )
            })}
          </div>

          {checked && (
            <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: isCorrect ? '#22C55E' : '#EF4444', fontWeight: 600 }}>
                {isCorrect ? '+15 XP' : 'Oof, maybe next time!'}
              </div>
              <button className="btn-primary" onClick={handleNext}>
                {currentIndex < questions.length - 1 ? 'Next Question →' : 'Finish Recap 🏁'}
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <RobCharacter 
            size="large"
            emotion={checked ? (isCorrect ? 'excited' : 'error') : 'teaching'}
            speech={checked ? q.explanation : "Select the best answer!"}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 11, 28, 0.98)',
      zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      padding: '40px 60px',
      overflowY: 'auto'
    }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🧠</div>
          <div>
            <div className="clash-display" style={{ fontSize: 24 }}>Quick Recap</div>
            <div style={{ color: 'var(--text-secondary)' }}>Warming up your circuits</div>
          </div>
        </div>
        <button className="btn-ghost" onClick={onClose} style={{ fontSize: 24 }}>✕</button>
      </div>

      {/* Progress steppers */}
      {!finished && questions.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          {questions.map((_, i) => (
            <div key={i} style={{ 
              height: 6, flex: 1, borderRadius: 3, 
              background: i < currentIndex ? '#7B3FE4' : i === currentIndex ? 'rgba(123,63,228,0.4)' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>
      )}

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        {renderContent()}
      </div>
    </div>
  )
}
