import { useEffect } from 'react'
import { usePracticeSession } from '../../hooks/usePracticeSession'

export default function PracticePanel({ conceptId }) {
  const {
    question,
    answer,
    setAnswer,
    feedback,
    modeLabel,
    loading,
    start,
    submitAnswer,
    nextQuestion,
  } = usePracticeSession(conceptId)

  useEffect(() => {
    start()
  }, [conceptId])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !feedback && !loading) submitAnswer()
  }

  return (
    <div className={`practice ${loading ? 'practice--loading' : ''}`}>
      <div className="practice__mode">Mode: {modeLabel}</div>

      {!question && !loading && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Loading your first question...
        </p>
      )}

      {question && (
        <div className="practice__question">
          <p>{question.text}</p>
          <input
            className="input-field"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Your answer..."
            disabled={!!feedback || loading}
            autoFocus
          />
        </div>
      )}

      <div className={`practice__feedback ${feedback ? 'show' : ''}`}>
        {feedback && (
          <>
            <div className={`practice__result ${feedback.correct ? 'practice__result--correct' : 'practice__result--wrong'}`}>
              {feedback.correct ? '✓ Correct!' : '✗ Not quite'}
            </div>
            <p className="practice__explanation">{feedback.explanation}</p>
          </>
        )}
      </div>

      <div className="practice__actions">
        {!feedback ? (
          <button
            className="practice__btn practice__btn--primary"
            onClick={submitAnswer}
            disabled={!answer.trim() || loading}
          >
            Submit
          </button>
        ) : (
          <button
            className="practice__btn practice__btn--primary"
            onClick={nextQuestion}
          >
            Next Question →
          </button>
        )}
      </div>
    </div>
  )
}
