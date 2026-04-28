import { useState, useEffect } from 'react'
import BloomCharacter from '../Bloom/BloomCharacter'
import { completeDayLesson } from '../../services/api'
import { useToast } from '../ui/Toast'
import { useConfig } from '../../context/ConfigContext'

export default function LessonPlayer({ planId, dayNumber, dayData, onComplete }) {
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [quizState, setQuizState] = useState('unanswered') // unanswered, correct, wrong
  const [score, setScore] = useState(0)
  const { showToast } = useToast()
  const config = useConfig()

  // SAFE QUIZ INTERRUPTION LOGIC
  const quizPauseIndices = config?.learning?.quizPauseIndex || [2, 4]
  const sections = dayData.sections || []
  const currentSection = sections[currentSectionIdx]

  // Bloom behavior mapped to level
  const bloomEmotions = {
    remember: 'talking',
    understand: 'happy',
    apply: 'excited',
    analyze: 'thinking',
    create: 'celebrating'
  }
  const currentEmotion = showQuiz 
    ? (quizState === 'correct' ? 'celebrating' : quizState === 'wrong' ? 'encouraging' : 'thinking')
    : bloomEmotions[dayData.bloomLevel] || 'idle'

  useEffect(() => {
    // If we land on an index that is a pause index, OR the section itself is a quiz type
    if (currentSection?.type === 'quiz' || (quizPauseIndices.includes(currentSectionIdx) && !showQuiz)) {
      if (currentSection?.type === 'quiz') {
        setShowQuiz(true)
      }
    }
  }, [currentSectionIdx, currentSection, quizPauseIndices, showQuiz])

  const handleNextSection = () => {
    if (currentSectionIdx + 1 < sections.length) {
      setCurrentSectionIdx(i => i + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    try {
      const finalScore = Math.round((score / Math.max(1, sections.filter(s => s.type === 'quiz').length)) * 100)
      await completeDayLesson(planId, dayNumber, { quizScore: finalScore, timeSpentMinutes: dayData.estimatedTime || 10 })
      showToast(`Lesson completed! +${dayData.xpReward || 50} XP`, 'success')
      if (onComplete) onComplete()
    } catch (err) {
      showToast('Failed to save progress', 'error')
    }
  }

  const handleQuizAnswer = (idx) => {
    if (quizState !== 'unanswered') return
    setSelectedOption(idx)
  }

  const checkAnswer = () => {
    if (!currentSection || currentSection.type !== 'quiz') return
    
    if (currentSection.options[selectedOption] === currentSection.answer) {
      setQuizState('correct')
      setScore(s => s + 1)
    } else {
      setQuizState('wrong')
    }
  }

  const continueAfterQuiz = () => {
    setShowQuiz(false)
    setQuizState('unanswered')
    setSelectedOption(null)
    handleNextSection()
  }

  if (!sections.length) return <div style={{ padding: 40, color: 'white' }}>No content available for this lesson.</div>

  return (
    <div style={{ position: 'relative', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: 400, border: '1px solid var(--border-color)', display: 'flex' }}>
      
      {/* Bloom Avatar Column */}
      <div style={{ width: 240, background: 'var(--bg-elevated)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32 }}>
        <div style={{ padding: '4px 12px', background: 'rgba(123,63,228,0.1)', color: 'var(--accent-purple-light)', borderRadius: 'var(--radius-xl)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 32 }}>
          {dayData.bloomLevel}
        </div>
        <BloomCharacter emotion={currentEmotion} size="medium" />
      </div>

      {/* Content Column */}
      <div style={{ flex: 1, padding: 40, display: 'flex', flexDirection: 'column' }}>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 4, background: i <= currentSectionIdx ? 'var(--accent-purple)' : 'var(--border-light)', borderRadius: 2 }} />
          ))}
        </div>

        {/* Normal Section Rendering (Explanation / Activity) */}
        {!showQuiz && currentSection && currentSection.type !== 'quiz' && (
          <div style={{ flex: 1, animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 16 }}>{currentSection.type}</h3>
            <div style={{ fontSize: 20, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {currentSection.text}
            </div>
            
            <div style={{ marginTop: 40 }}>
              <button className="btn-primary" onClick={handleNextSection}>
                {currentSectionIdx === sections.length - 1 ? 'Complete Lesson ✅' : 'Continue →'}
              </button>
            </div>
          </div>
        )}

        {/* Quiz Rendering */}
        {showQuiz && currentSection && currentSection.type === 'quiz' && (
          <div style={{ flex: 1, animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ fontSize: 13, color: 'var(--accent-orange)', textTransform: 'uppercase', marginBottom: 16 }}>Checkpoint Quiz</h3>
            
            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>
              {currentSection.question || currentSection.text}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {currentSection.options?.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = opt === currentSection.answer;
                let bg = 'var(--bg-elevated)';
                let border = 'var(--border-color)';
                
                if (quizState !== 'unanswered') {
                  if (isCorrect) {
                    bg = 'rgba(34,197,94,0.15)';
                    border = 'var(--accent-green)';
                  } else if (isSelected && !isCorrect) {
                    bg = 'rgba(239,68,68,0.12)';
                    border = 'rgba(239,68,68,0.4)';
                  }
                } else if (isSelected) {
                  bg = 'rgba(123,63,228,0.15)';
                  border = 'var(--accent-purple)';
                }

                return (
                  <button key={i} onClick={() => handleQuizAnswer(i)} disabled={quizState !== 'unanswered'} style={{ padding: '16px 20px', textAlign: 'left', background: bg, border: `1px solid ${border}`, borderRadius: 'var(--radius-md)', fontSize: 16, color: 'var(--text-primary)', cursor: quizState === 'unanswered' ? 'pointer' : 'default' }}>
                    {opt} {quizState !== 'unanswered' && isCorrect && '✅'} {quizState !== 'unanswered' && isSelected && !isCorrect && '❌'}
                  </button>
                )
              })}
            </div>

            {quizState === 'unanswered' ? (
              <button className="btn-primary" disabled={selectedOption === null} onClick={checkAnswer}>
                Check Answer
              </button>
            ) : (
              <div>
                <button className="btn-primary" onClick={continueAfterQuiz}>
                  {currentSectionIdx === sections.length - 1 ? 'Complete Lesson ✅' : 'Continue Lesson →'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
