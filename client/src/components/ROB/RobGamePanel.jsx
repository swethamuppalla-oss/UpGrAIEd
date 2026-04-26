import { useEffect, useState } from 'react'
import { useROB } from '../../context/RobContext'
import RobCharacter from './RobCharacter'

const GAMES = [
  { target: 'Generative AI', options: ['Generates images from text', 'Classifies spam emails', 'Predicts house prices', 'Sorts spreadsheets'], correct: 0 },
  { target: 'Computer Vision', options: ['Translates text', 'Summarizes books', 'Recognizes faces in photos', 'Plays music'], correct: 2 },
  { target: 'Training Data', options: ['The code that runs the AI', 'The examples the AI learns from', 'The computer processor', 'The internet connection'], correct: 1 },
  { target: 'Prompt Engineering', options: ['Building a computer', 'Writing code in Python', 'Designing the best instructions for AI', 'Fixing a broken robot'], correct: 2 },
  { target: 'Hallucination', options: ['When AI sees a ghost', 'When AI confidently makes up fake information', 'When the computer overheats', 'When you type too fast'], correct: 1 },
]

const TIMER_MAX = 10
const TIMER_R = 16
const TIMER_C = 2 * Math.PI * TIMER_R

export default function RobGamePanel() {
  const { addXP } = useROB()
  const [round, setRound] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_MAX)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('idle') // idle | playing | roundEnd | finished
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) { handleTimeout(); return }
    const t = setInterval(() => setTimeLeft(n => n - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, gameState])

  const startGame = () => {
    setRound(0); setScore(0); setSelected(null)
    setGameState('playing'); setTimeLeft(TIMER_MAX)
  }

  const handleAnswer = (idx) => {
    if (gameState !== 'playing') return
    setSelected(idx)
    if (idx === GAMES[round].correct) {
      const bonus = Math.floor(timeLeft / 2)
      setScore(s => s + 10 + bonus)
    }
    setGameState('roundEnd')
  }

  const handleTimeout = () => { setSelected(-1); setGameState('roundEnd') }

  const nextRound = () => {
    if (round < GAMES.length - 1) {
      setRound(r => r + 1)
      setGameState('playing')
      setTimeLeft(TIMER_MAX)
      setSelected(null)
    } else {
      const totalXP = score + 20
      addXP(totalXP)
      setGameState('finished')
    }
  }

  const timerOffset = TIMER_C * (1 - timeLeft / TIMER_MAX)
  const isRoundEnd = gameState === 'roundEnd'

  return (
    <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 380 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div className="clash-display" style={{ fontSize: 18 }}>🕹️ Speed Game</div>
        {gameState === 'playing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r={TIMER_R} stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
              <circle
                cx="20" cy="20" r={TIMER_R}
                stroke={timeLeft <= 3 ? '#EF4444' : '#00D4FF'}
                strokeWidth="4" fill="none"
                strokeDasharray={TIMER_C}
                strokeDashoffset={timerOffset}
                transform="rotate(-90 20 20)"
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
              />
              <text x="20" y="25" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">{timeLeft}</text>
            </svg>
            <span style={{ fontSize: 13, color: '#FCD34D', fontWeight: 700 }}>{score} pts</span>
          </div>
        )}
      </div>

      {gameState === 'idle' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center' }}>
          <RobCharacter size="small" emotion="excited" speech="I love speed rounds!" />
          <div>
            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>Concept Speedrun</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
              Match definitions to AI concepts before time runs out.<br />Faster answers = more XP!
            </div>
          </div>
          <button type="button" className="btn-primary" onClick={startGame}>Start Game 🚀</button>
        </div>
      )}

      {gameState === 'finished' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center' }}>
          <RobCharacter size="small" emotion="celebrating" speech="You absolute legend!" />
          <div className="clash-display" style={{ fontSize: 40, color: '#FFD700', lineHeight: 1 }}>+{score + 20} XP</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Game complete — XP added to your total!</div>
          <button type="button" className="btn-primary" onClick={startGame} style={{ marginTop: 8 }}>Play Again 🔄</button>
        </div>
      )}

      {(gameState === 'playing' || isRoundEnd) && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {GAMES.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i < round ? '#22C55E' : i === round ? '#00D4FF' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: '6px 0' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--text-secondary)', marginBottom: 6 }}>What is...</div>
            <div className="clash-display" style={{ fontSize: 22, color: '#00D4FF' }}>{GAMES[round].target}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {GAMES[round].options.map((opt, idx) => {
              const isSelected = selected === idx
              const isCorrect = idx === GAMES[round].correct
              const showGreen = isRoundEnd && isCorrect
              const showRed = isRoundEnd && isSelected && !isCorrect
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAnswer(idx)}
                  disabled={isRoundEnd}
                  style={{
                    padding: '10px 8px', borderRadius: 12,
                    background: showGreen ? 'rgba(34,197,94,0.15)' : showRed ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${showGreen ? '#22C55E' : showRed ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
                    color: 'white', cursor: isRoundEnd ? 'default' : 'pointer',
                    fontSize: 12, textAlign: 'left', lineHeight: 1.4, transition: 'all 0.2s', fontFamily: 'inherit',
                  }}
                >
                  {opt}
                  {showGreen && <span> ✅</span>}
                  {showRed && <span> ❌</span>}
                </button>
              )
            })}
          </div>

          {isRoundEnd && (
            <button type="button" className="btn-primary" onClick={nextRound} style={{ width: '100%', animation: 'dashboardRise 0.3s ease' }}>
              {round < GAMES.length - 1 ? `Next Round →` : 'Finish Game 🏁'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
