import { useEffect, useState } from 'react'
import { useROB } from '../../context/RobContext'
import RobCharacter from './RobCharacter'

const GAMES = [
  {
    target: "Generative AI",
    options: ["Generates images from text", "Classifies spam emails", "Predicts house prices", "Sorts spreadsheets"],
    correct: 0,
  },
  {
    target: "Computer Vision",
    options: ["Translates text", "Summarizes books", "Recognizes faces in photos", "Plays music"],
    correct: 2,
  },
  {
    target: "Training Data",
    options: ["The code that runs the AI", "The examples the AI learns from", "The computer processor", "The internet connection"],
    correct: 1,
  },
  {
    target: "Prompt Engineering",
    options: ["Building a computer", "Writing code in Python", "Designing the best instructions for AI", "Fixing a broken robot"],
    correct: 2,
  },
  {
    target: "Hallucination",
    options: ["When AI sees a ghost", "When AI confidently makes up fake information", "When the computer overheats", "When you type too fast"],
    correct: 1,
  }
]

export default function RobMiniGame({ visible, onClose }) {
  const { addXP } = useROB()
  const [round, setRound] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('intro') // intro, playing, roundEnd, finished
  const [selected, setSelected] = useState(null)

  // Timer logic
  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) {
      handleTimeout()
      return
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, gameState])

  if (!visible) return null

  const startGame = () => {
    setRound(0)
    setScore(0)
    setGameState('playing')
    setTimeLeft(10)
    setSelected(null)
  }

  const handleAnswer = (index) => {
    if (gameState !== 'playing') return
    setSelected(index)
    const isCorrect = index === GAMES[round].correct
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 2) // Max 5 bonus XP per round
      setScore(s => s + 10 + timeBonus)
    }
    setGameState('roundEnd')
  }

  const handleTimeout = () => {
    setSelected(-1) // Timeout
    setGameState('roundEnd')
  }

  const nextRound = () => {
    if (round < GAMES.length - 1) {
      setRound(r => r + 1)
      setGameState('playing')
      setTimeLeft(10)
      setSelected(null)
    } else {
      setGameState('finished')
      addXP(score) // Reward XP at the end
    }
  }

  const renderContent = () => {
    if (gameState === 'intro') {
      return (
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>⏱️</div>
          <h2 className="clash-display" style={{ fontSize: 36, marginBottom: 16 }}>Concept Match Speedrun</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 40 }}>
            Match the definition to the AI concept before time runs out! Faster answers = more XP.
          </p>
          <button className="btn-primary" onClick={startGame} style={{ fontSize: 20, padding: '16px 32px' }}>
            Start Engine 🚀
          </button>
        </div>
      )
    }

    if (gameState === 'finished') {
      return (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <RobCharacter size="hero" emotion="celebrating" speech="Amazing speed!" />
          <h2 className="clash-display" style={{ fontSize: 48, marginTop: 30, color: '#FFD700' }}>
            {score} XP Earned!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, margin: '20px 0 40px' }}>
            Mini-game complete. Great reflexes!
          </p>
          <button className="btn-primary" onClick={onClose} style={{ width: 200 }}>
            Collect XP
          </button>
        </div>
      )
    }

    const currentType = GAMES[round]
    const isRoundEnd = gameState === 'roundEnd'
    const isCorrect = selected === currentType.correct

    return (
      <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-secondary)' }}>Round {round + 1}/5</div>
          <div style={{ 
            fontSize: 24, fontWeight: 700, 
            color: timeLeft <= 3 ? '#EF4444' : 'white',
            background: 'rgba(255,255,255,0.05)', padding: '8px 20px', borderRadius: 999 
          }}>
            {timeLeft}s
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#FCD34D' }}>Score: {score}</div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-secondary)', marginBottom: 12 }}>
            What is...
          </div>
          <div className="clash-display" style={{ fontSize: 42, color: '#00D4FF' }}>
            {currentType.target}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
          {currentType.options.map((opt, idx) => {
            const isSelected = selected === idx
            const optCorrect = idx === currentType.correct
            
            let bg = 'rgba(255,255,255,0.03)'
            let border = 'rgba(255,255,255,0.1)'
            if (isRoundEnd) {
              if (optCorrect) {
                bg = 'rgba(34,197,94,0.15)'
                border = '#22C55E'
              } else if (isSelected && !optCorrect) {
                 bg = 'rgba(239,68,68,0.15)'
                 border = '#EF4444'
              }
            } else if (isSelected) {
              border = 'white'
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isRoundEnd}
                style={{
                  padding: '24px 20px',
                  borderRadius: 16,
                  background: bg,
                  border: `2px solid ${border}`,
                  fontSize: 18,
                  color: 'white',
                  cursor: isRoundEnd ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {opt}
                {isRoundEnd && optCorrect && <span style={{position:'absolute', top: 8, right: 12, fontSize: 20}}>✅</span>}
                {isRoundEnd && isSelected && !optCorrect && <span style={{position:'absolute', top: 8, right: 12, fontSize: 20}}>❌</span>}
              </button>
            )
          })}
        </div>

        {isRoundEnd && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'dashboardRise 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <RobCharacter size="small" emotion={isCorrect ? 'excited' : 'error'} />
              <div style={{ fontSize: 20, fontWeight: 700, color: isCorrect ? '#22C55E' : '#EF4444' }}>
                {isCorrect ? 'Correct! +10 XP' : selected === -1 ? 'Out of time!' : 'Incorrect!'}
              </div>
            </div>
            <button className="btn-primary" onClick={nextRound} style={{ padding: '16px 32px' }}>
              {round < GAMES.length - 1 ? 'Next Round →' : 'Finish Game 🏁'}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(10, 5, 20, 0.98)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      padding: '40px 60px',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
         <button className="btn-ghost" onClick={onClose} style={{ fontSize: 24, padding: 10 }}>✕</button>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {renderContent()}
      </div>
    </div>
  )
}
