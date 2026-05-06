import { useState } from 'react'
import BloomCharacter from '../Bloom/BloomCharacter'
import { submitWeeklyExam } from '../../services'
import { useToast } from '../ui/Toast'

export default function ExamPlayer({ planId, dayData, chapterTitle, onComplete }) {
  const [examState, setExamState] = useState('intro') // intro, playing, results
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [results, setResults] = useState(null)
  const { showToast } = useToast()

  const questions = dayData.examQuestions || []

  const handleNext = () => {
    const newAnswers = [...answers]
    newAnswers[qIdx] = { selectedIndex: selectedOption, timeTakenSeconds: 10 }
    setAnswers(newAnswers)
    
    if (qIdx + 1 < questions.length) {
      setQIdx(i => i + 1)
      setSelectedOption(newAnswers[qIdx + 1]?.selectedIndex ?? null)
    }
  }

  const handleBack = () => {
    if (qIdx > 0) {
      setQIdx(i => i - 1)
      setSelectedOption(answers[qIdx - 1]?.selectedIndex ?? null)
    }
  }

  const handleSubmit = async () => {
    const finalAnswers = [...answers]
    finalAnswers[qIdx] = { selectedIndex: selectedOption, timeTakenSeconds: 10 }
    
    try {
      setExamState('results')
      const res = await submitWeeklyExam(planId, finalAnswers, 20)
      setResults(res)
    } catch (err) {
      showToast('Failed to submit exam', 'error')
      setExamState('playing')
    }
  }

  if (examState === 'intro') {
    return (
      <div className="lesson-container" style={{ padding: 64, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h1 className="clash-display" style={{ fontSize: 32, marginBottom: 8 }}>📝 Weekly Exam</h1>
        <div style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32 }}>{chapterTitle}</div>
        <div style={{ fontSize: 18, marginBottom: 32 }}>
          {questions.length} questions · No time limit
        </div>
        <div style={{ marginBottom: 40 }}>
          <BloomCharacter emotion="excited" size="medium" />
          <p style={{ marginTop: 16, color: 'var(--text-primary)', fontWeight: 600 }}>You can do it! Bloom believes in you 🌿</p>
        </div>
        <button className="ui-button-primary" onClick={() => setExamState('playing')} style={{ padding: '16px 40px', fontSize: 18 }}>
          Start Exam
        </button>
      </div>
    )
  }

  if (examState === 'results') {
    if (!results) return <div style={{ textAlign: 'center', padding: 40 }}>Scoring exam...</div>

    const emotion = results.score >= 80 ? 'celebrating' : results.score >= 60 ? 'happy' : 'encouraging'
    
    return (
      <div className="lesson-container" style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <BloomCharacter emotion={emotion} size="large" />
          <div className="clash-display" style={{ fontSize: 80, background: 'linear-gradient(135deg, #FF5C28, #7B3FE4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '16px 0' }}>
            {results.score}%
          </div>
          <div style={{ fontSize: 18, color: 'var(--text-secondary)' }}>
            {results.correct} out of {results.total} correct
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid var(--accent-green)', padding: 24, borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ color: 'var(--accent-green)', marginBottom: 16, fontSize: 16 }}>✅ Strong Concepts</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-primary)' }}>
              {results.strongConcepts?.map((c, i) => <li key={i} style={{ marginBottom: 8 }}>{c}</li>)}
              {results.strongConcepts?.length === 0 && <li style={{ opacity: 0.5 }}>None detected</li>}
            </ul>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', padding: 24, borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ color: '#EF4444', marginBottom: 16, fontSize: 16 }}>❌ Needs Revision</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-primary)' }}>
              {results.weakConcepts?.map((c, i) => <li key={i} style={{ marginBottom: 8 }}>{c}</li>)}
              {results.weakConcepts?.length === 0 && <li style={{ opacity: 0.5 }}>None detected</li>}
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="ui-button-primary" onClick={onComplete}>Back to Dashboard</button>
        </div>
      </div>
    )
  }

  const q = questions[qIdx]

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.1)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--accent-primary)', width: `${((qIdx) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Question {qIdx + 1} / {questions.length}</div>
      </div>

      <div className="ui-card" style={{ marginBottom: 24, padding: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 32 }}>{q.question}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {q.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => setSelectedOption(i)}
              style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                background: selectedOption === i ? 'rgba(123,63,228,0.15)' : 'rgba(0,0,0,0.03)', 
                border: `1px solid ${selectedOption === i ? 'var(--accent-primary)' : 'var(--border-color)'}`, 
                borderRadius: 'var(--radius-md)', 
                fontSize: 16, 
                color: 'var(--text-primary)', 
                cursor: 'pointer' 
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="ui-button-secondary" onClick={handleBack} disabled={qIdx === 0} style={{ opacity: qIdx === 0 ? 0.5 : 1 }}>
          ← Back
        </button>
        
        {qIdx === questions.length - 1 ? (
          <button className="ui-button-primary" onClick={handleSubmit} disabled={selectedOption === null}>
            Submit Exam
          </button>
        ) : (
          <button className="ui-button-primary" onClick={handleNext} disabled={selectedOption === null}>
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
