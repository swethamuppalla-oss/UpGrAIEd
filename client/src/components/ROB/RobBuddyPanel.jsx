import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useROB } from '../../context/RobContext'
import { chatWithROB, getROBQuiz } from '../../services/api'
import RobCharacter from './RobCharacter'

const tabs = [
  { id: 'quiz', label: '🎯 Quiz Me' },
  { id: 'chat', label: '💬 Chat' },
  { id: 'stats', label: '📊 My Stats' },
]

const starterPrompts = [
  'What is AI?',
  'How does ROB learn?',
  'What is training data?',
  'Am I doing well?',
]

const levelTitles = {
  1: 'AI Curious',
  2: 'AI Explorer',
  3: 'AI Builder',
  4: 'AI Trainer',
  5: 'AI Master',
}

export default function RobBuddyPanel({ open, onClose, currentModuleId }) {
  const { user } = useAuth()
  const {
    robXP,
    robLevel,
    badges,
    lessonsCompleted,
    levelProgress,
    levelTitle,
    xpToday,
    questionsAnswered,
    accuracy,
    recordAnswer,
  } = useROB()

  const [activeTab, setActiveTab] = useState('quiz')
  const [quiz, setQuiz] = useState(null)
  const [quizState, setQuizState] = useState({ loading: false, selected: null, checked: false, correct: false })
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [streaming, setStreaming] = useState('')
  const typeTimerRef = useRef(null)
  const chatBodyRef = useRef(null)

  useEffect(() => {
    if (!open || activeTab !== 'quiz') return
    setQuizState({ loading: true, selected: null, checked: false, correct: false })
    getROBQuiz(currentModuleId)
      .then((data) => {
        setQuiz(data)
        setQuizState({ loading: false, selected: null, checked: false, correct: false })
      })
      .catch(() => {
        setQuiz({ available: false })
        setQuizState({ loading: false, selected: null, checked: false, correct: false })
      })
  }, [activeTab, currentModuleId, open])

  useEffect(() => {
    if (!chatBodyRef.current) return
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
  }, [messages, streaming])

  useEffect(() => () => window.clearInterval(typeTimerRef.current), [])

  const handleQuizAnswer = (index) => {
    if (!quiz?.available || quizState.checked) return
    const correct = Boolean(quiz.options?.[index]?.isCorrect)
    setQuizState({
      loading: false,
      selected: index,
      checked: true,
      correct,
    })
    recordAnswer(correct)
  }

  const loadNextQuiz = () => {
    setQuizState({ loading: true, selected: null, checked: false, correct: false })
    getROBQuiz(currentModuleId)
      .then((data) => {
        setQuiz(data)
        setQuizState({ loading: false, selected: null, checked: false, correct: false })
      })
      .catch(() => {
        setQuiz({ available: false })
        setQuizState({ loading: false, selected: null, checked: false, correct: false })
      })
  }

  const sendMessage = (text) => {
    const question = text.trim()
    if (!question || chatLoading) return

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: question }])
    setDraft('')
    setChatLoading(true)
    setStreaming('')

    chatWithROB(question, currentModuleId)
      .then((response) => {
        const answer = response.answer || "Hmm, I don't know that yet! Maybe ask your teacher to train me on this topic! 🤔"
        let index = 0
        window.clearInterval(typeTimerRef.current)
        typeTimerRef.current = window.setInterval(() => {
          index += 1
          setStreaming(answer.slice(0, index))
          if (index >= answer.length) {
            window.clearInterval(typeTimerRef.current)
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'rob', text: answer, confidence: response.confidence || 0 }])
            setStreaming('')
            setChatLoading(false)
          }
        }, 18)
      })
      .catch(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 2,
          role: 'rob',
          text: "Hmm, I don't know that yet! Maybe ask your teacher to train me on this topic! 🤔",
          confidence: 0,
        }])
        setChatLoading(false)
      })
  }

  const statsTitle = useMemo(() => {
    if (robLevel <= 5) return levelTitles[robLevel]
    return levelTitle
  }, [levelTitle, robLevel])

  if (!open) return null

  return (
    <>
      <style>{`
        @keyframes robPanelEnter {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 720px) {
          .rob-buddy-panel {
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
      <div
        className="rob-buddy-panel"
        style={{
          position: 'fixed',
          right: 24,
          bottom: 100,
          width: 340,
          height: 480,
          background: '#0F0B1C',
          border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.1)',
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'robPanelEnter 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <RobCharacter size="small" emotion="happy" />
          <div style={{ flex: 1 }}>
            <div className="clash-display" style={{ fontSize: 16 }}>ROB</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Your AI Buddy</div>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose} style={{ padding: '6px 10px' }}>
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                background: activeTab === tab.id ? 'rgba(0,212,255,0.14)' : 'rgba(255,255,255,0.03)',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                padding: '10px 8px',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: 14 }}>
          {activeTab === 'quiz' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <RobCharacter
                  size="small"
                  emotion={quizState.checked ? (quizState.correct ? 'excited' : 'error') : 'teaching'}
                  speech={
                    quizState.loading
                      ? 'Let me find a good question...'
                      : quiz?.available
                      ? (quizState.checked
                        ? (quizState.correct ? `Correct! ${quiz.explanation}` : `Not quite! ${quiz.explanation}`)
                        : quiz.question)
                      : "My creator hasn't added quiz questions yet! Ask them to train me! 📚"
                  }
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(quiz?.options || []).map((option, index) => {
                  const selected = quizState.selected === index
                  const correct = Boolean(option.isCorrect)
                  const showCorrect = quizState.checked && correct
                  const showWrong = quizState.checked && selected && !correct
                  return (
                    <button
                      key={`${option.text}-${index}`}
                      type="button"
                      onClick={() => handleQuizAnswer(index)}
                      disabled={quizState.checked || quizState.loading}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 14px',
                        borderRadius: 14,
                        border: `1px solid ${showCorrect ? 'rgba(34,197,94,0.5)' : showWrong ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        background: showCorrect
                          ? 'rgba(34,197,94,0.18)'
                          : showWrong
                          ? 'rgba(239,68,68,0.18)'
                          : 'rgba(255,255,255,0.03)',
                        color: 'var(--text-primary)',
                        cursor: quizState.checked ? 'default' : 'pointer',
                      }}
                    >
                      {option.text}
                    </button>
                  )
                })}
              </div>

              {quizState.checked && (
                <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                  <button type="button" className="btn-primary" onClick={loadNextQuiz} style={{ flex: 1 }}>
                    Next Question →
                  </button>
                  <button type="button" className="btn-ghost" onClick={loadNextQuiz}>
                    Skip →
                  </button>
                </div>
              )}
              {quizState.correct && (
                <div className="inline-success">+15 XP for that answer</div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                ref={chatBodyRef}
                style={{
                  flex: 1,
                  maxHeight: 280,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  paddingRight: 6,
                }}
              >
                {messages.length === 0 && !streaming && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {starterPrompts.map(prompt => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        style={{
                          borderRadius: 999,
                          border: '1px solid rgba(255,255,255,0.08)',
                          padding: '8px 12px',
                          background: 'rgba(255,255,255,0.04)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map(message => (
                  <div
                    key={message.id}
                    style={{
                      alignSelf: message.role === 'rob' ? 'flex-start' : 'flex-end',
                      maxWidth: '84%',
                      display: 'flex',
                      gap: 8,
                    }}
                  >
                    {message.role === 'rob' && <RobCharacter size="small" emotion="teaching" style={{ width: 38 }} />}
                    <div
                      style={{
                        padding: '10px 12px',
                        borderRadius: 14,
                        background: message.role === 'rob' ? 'rgba(0,212,255,0.12)' : 'rgba(123,63,228,0.18)',
                        color: 'var(--text-primary)',
                        lineHeight: 1.5,
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {streaming && (
                  <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 8, maxWidth: '84%' }}>
                    <RobCharacter size="small" emotion="thinking" style={{ width: 38 }} />
                    <div style={{ padding: '10px 12px', borderRadius: 14, background: 'rgba(0,212,255,0.12)', color: 'var(--text-primary)' }}>
                      {streaming}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <input
                  className="input-field"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') sendMessage(draft)
                  }}
                  placeholder="Ask ROB anything about AI..."
                />
                <button type="button" className="btn-primary" onClick={() => sendMessage(draft)} disabled={chatLoading}>
                  →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <RobCharacter
                  size="medium"
                  emotion="excited"
                  speech={`${user?.name?.split(' ')[0] || 'Student'} is my BEST student! 🌟`}
                />
              </div>

              <div style={{ padding: 16, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="clash-display" style={{ fontSize: 28 }}>{robXP} XP</div>
                <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', margin: '10px 0 8px' }}>
                  <div style={{ width: `${levelProgress}%`, height: '100%', background: 'linear-gradient(90deg, #FF5C28, #7B3FE4)', borderRadius: 999 }} />
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                  Level {robLevel} AI {statsTitle}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  ['Modules completed', lessonsCompleted.length],
                  ['XP today', xpToday],
                  ['Questions answered', questionsAnswered],
                  ['Correct answers', `${accuracy}%`],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: 12, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="clash-display" style={{ fontSize: 20 }}>{value}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ marginBottom: 10, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-secondary)' }}>
                  Recent badges
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {(badges.slice(-3).length ? badges.slice(-3) : ['first-spark']).map((badge) => (
                    <div key={badge} style={{ padding: 12, borderRadius: 16, textAlign: 'center', background: 'rgba(123,63,228,0.12)', border: '1px solid rgba(123,63,228,0.25)' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>🏅</div>
                      <div style={{ fontSize: 11, color: 'var(--text-primary)' }}>{badge}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" className="btn-ghost" style={{ marginTop: 'auto' }}>
                View all badges →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
