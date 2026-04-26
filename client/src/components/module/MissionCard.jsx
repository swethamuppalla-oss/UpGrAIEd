import { useState } from 'react'
import RobCharacter from '../ROB/RobCharacter'

const CHECKLIST = [
  { id: 'wake', label: 'Wake up time', emoji: '⏰', example: 'e.g. 6:30 AM — enough time to get ready' },
  { id: 'homework', label: 'Homework time', emoji: '📚', example: 'e.g. 4:00 PM — 1 hour after school' },
  { id: 'play', label: 'Play / hobby time', emoji: '⚽', example: 'e.g. 5:30 PM — football with friends' },
  { id: 'sleep', label: 'Sleep time', emoji: '🌙', example: 'e.g. 9:00 PM — 9 hours for growing brains' },
]

export default function MissionCard({ robName, robColor = 'cyan', onSubmit, submitted }) {
  const [checked, setChecked] = useState({})
  const [planText, setPlanText] = useState('')
  const [focused, setFocused] = useState(false)
  const [expandedHint, setExpandedHint] = useState(null)

  const checkedCount = Object.values(checked).filter(Boolean).length
  const allChecked = checkedCount === CHECKLIST.length
  const hasText = planText.trim().length >= 30
  const canSubmit = allChecked && hasText

  const toggleCheck = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
    setExpandedHint(id === expandedHint ? null : id)
  }

  return (
    <div style={{
      background: 'linear-gradient(145deg, #1A1A26, #12121A)',
      border: '1px solid rgba(255,122,47,0.22)',
      borderRadius: 22, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 20px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,122,47,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg, #FF7A2F, #C2410C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 4px 12px rgba(255,122,47,0.35)',
          }}>🚀</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>
              Today's Mission
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>
              Plan your perfect school day with AI
            </div>
          </div>
        </div>
        <div style={{
          background: 'rgba(255,122,47,0.12)',
          border: '1px solid rgba(255,122,47,0.3)',
          borderRadius: 8, padding: '4px 12px',
          fontSize: 12, fontWeight: 700, color: '#FF7A2F',
        }}>
          +50 XP
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {submitted ? (
          /* Success state */
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ marginBottom: 16 }}>
              <RobCharacter size="medium" emotion="celebrating" color={robColor} showSpeech speechText="Mission accomplished! 🚀" />
            </div>
            <div style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 16, padding: '20px',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#4ADE80', marginBottom: 6 }}>
                Mission Submitted!
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Amazing work! Your AI-powered plan is saved.<br />Get ready to claim your reward!
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mission description */}
            <div style={{
              background: 'rgba(255,122,47,0.07)',
              border: '1px solid rgba(255,122,47,0.15)',
              borderRadius: 14, padding: '14px 16px', marginBottom: 18,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                📋 Your Mission
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Use an AI tool (like ChatGPT or {robName}) to create your perfect school day plan. Include all 4 time blocks below, then paste your plan!
              </div>
            </div>

            {/* Checklist */}
            <div style={{ marginBottom: 18 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: 1,
                marginBottom: 10,
              }}>
                Checklist ({checkedCount}/{CHECKLIST.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CHECKLIST.map(item => (
                  <div key={item.id}>
                    <button
                      onClick={() => toggleCheck(item.id)}
                      style={{
                        width: '100%', textAlign: 'left',
                        background: checked[item.id]
                          ? 'rgba(34,197,94,0.1)'
                          : 'rgba(255,255,255,0.03)',
                        border: `1.5px solid ${checked[item.id] ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 12, padding: '11px 14px',
                        cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                        background: checked[item.id] ? '#22C55E' : 'rgba(255,255,255,0.07)',
                        border: `1.5px solid ${checked[item.id] ? '#22C55E' : 'rgba(255,255,255,0.12)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                        fontSize: 13,
                      }}>
                        {checked[item.id] ? '✓' : ''}
                      </div>
                      <span style={{ fontSize: 18 }}>{item.emoji}</span>
                      <span style={{
                        fontSize: 13, fontWeight: 600,
                        color: checked[item.id] ? '#4ADE80' : 'var(--text-secondary)',
                        textDecoration: checked[item.id] ? 'line-through' : 'none',
                        transition: 'all 0.2s',
                      }}>
                        {item.label}
                      </span>
                    </button>

                    {expandedHint === item.id && checked[item.id] && (
                      <div style={{
                        marginTop: 4, padding: '8px 14px',
                        background: 'rgba(34,197,94,0.06)',
                        border: '1px solid rgba(34,197,94,0.15)',
                        borderRadius: '0 0 10px 10px',
                        fontSize: 11, color: 'var(--text-muted)',
                        animation: 'slideUpFade 0.2s ease',
                      }}>
                        💡 {item.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 10 }}>
                <div style={{
                  height: 4, borderRadius: 99,
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    width: `${(checkedCount / CHECKLIST.length) * 100}%`,
                    background: 'linear-gradient(90deg, #22C55E, #4ADE80)',
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            </div>

            {/* Paste plan */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
              }}>
                Paste Your AI Plan Here
              </div>
              <textarea
                value={planText}
                onChange={e => setPlanText(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="e.g. 6:30 AM – Wake up and stretch&#10;7:00 AM – Breakfast&#10;8:00 AM – School&#10;4:00 PM – Homework (45 min)&#10;5:00 PM – Football practice&#10;7:00 PM – Dinner&#10;8:00 PM – Reading&#10;9:00 PM – Sleep"
                rows={5}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${focused ? 'rgba(255,122,47,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12, padding: '13px 14px',
                  color: 'var(--text-primary)', fontSize: 13, lineHeight: 1.6,
                  resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
              />
              <div style={{
                marginTop: 5, fontSize: 11, color: 'var(--text-muted)',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>Minimum 30 characters</span>
                <span style={{ color: hasText ? '#4ADE80' : 'var(--text-muted)' }}>
                  {planText.trim().length} chars {hasText && '✓'}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={() => canSubmit && onSubmit(planText)}
              disabled={!canSubmit}
              style={{
                width: '100%', padding: '13px',
                background: canSubmit
                  ? 'linear-gradient(135deg, #FF7A2F, #C2410C)'
                  : 'rgba(255,255,255,0.05)',
                border: 'none', borderRadius: 14,
                color: canSubmit ? '#fff' : 'var(--text-muted)',
                fontWeight: 800, fontSize: 14, cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: canSubmit ? '0 4px 20px rgba(255,122,47,0.4)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (canSubmit) e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            >
              🚀 Submit Mission
              {!canSubmit && (
                <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>
                  ({!allChecked ? `${CHECKLIST.length - checkedCount} items left` : 'write your plan'})
                </span>
              )}
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
