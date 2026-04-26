import { useState } from 'react'
import RobCharacter from '../ROB/RobCharacter'

const LESSON_POINTS = [
  { icon: '⏰', text: 'AI can help you organize your time like a pro' },
  { icon: '💬', text: 'Better prompts = smarter, more useful AI answers' },
  { icon: '⚖️', text: 'Balance study, play and rest for peak performance' },
]

const ROB_RESPONSES = {
  timetable: {
    emoji: '⏰',
    title: 'Making Your Timetable',
    text: 'Try asking AI: "Help me make a school timetable. I wake up at 7am, school is 8am–3pm, I have football at 5pm and need 30 mins of homework. Create my perfect day!"',
  },
  prompt: {
    emoji: '💡',
    title: 'What is a Prompt?',
    text: 'A prompt is the question or instruction you give AI. Better prompts = better answers! Instead of "help with math", try "explain fractions to a 12-year-old using pizza examples".',
  },
  example: {
    emoji: '🌟',
    title: 'Real AI Example',
    text: 'Amara asked AI: "Plan my Sunday so I finish homework, practice piano for 20 mins, and still have 2 hours to play." AI gave her a perfect hour-by-hour schedule. You can do this too!',
  },
}

export default function VideoSection({ robName, robColor = 'cyan', isVideoStarted, onVideoStart }) {
  const [activeResponse, setActiveResponse] = useState(null)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
      gap: 20,
      alignItems: 'start',
    }}>
      {/* LEFT: Video player */}
      <div>
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          background: 'linear-gradient(145deg, #0D0B1C, #12121A)',
          borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}>
          {/* Placeholder content */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(145deg, #0D0B1C 0%, #1A1030 60%, #0D1225 100%)',
          }}>
            {/* Ambient orbs */}
            <div style={{
              position: 'absolute', width: 280, height: 280, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(123,63,228,0.18) 0%, transparent 70%)',
              top: '-10%', left: '5%', pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', width: 180, height: 180, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
              bottom: '0%', right: '10%', pointerEvents: 'none',
            }} />

            {!isVideoStarted ? (
              <>
                <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
                  <RobCharacter size="medium" emotion="teaching" color={robColor} />
                </div>
                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontSize: 16, fontWeight: 800,
                    color: 'var(--text-primary)', marginBottom: 6,
                  }}>
                    Module 1 · {robName} Saves Your Day
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    🎬 8–10 minutes · Click play to begin
                  </div>
                </div>
              </>
            ) : (
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🎬</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Video Playing...
                </div>
                <div style={{ fontSize: 12, color: '#9B6FF4', marginTop: 4 }}>
                  (Replace with your video embed)
                </div>
              </div>
            )}
          </div>

          {/* Play overlay */}
          {!isVideoStarted && (
            <button
              onClick={onVideoStart}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(123,63,228,0.9), rgba(91,45,180,0.9))',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px rgba(123,63,228,0.7)',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >
                <svg width="24" height="26" viewBox="0 0 24 26" fill="none">
                  <path d="M2 2L22 13L2 24V2Z" fill="white" />
                </svg>
              </div>
            </button>
          )}

          {/* Duration pill */}
          <div style={{
            position: 'absolute', bottom: 14, right: 14, zIndex: 10,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
            borderRadius: 8, padding: '4px 10px',
            fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
          }}>
            ⏱ 8–10 min
          </div>

          {isVideoStarted && (
            <div style={{
              position: 'absolute', top: 14, left: 14, zIndex: 10,
              background: 'rgba(239,68,68,0.85)',
              borderRadius: 6, padding: '3px 8px',
              fontSize: 11, fontWeight: 700, color: '#fff',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#fff', animation: 'pulse 1s infinite',
              }} />
              LIVE
            </div>
          )}
        </div>

        {/* Lesson points */}
        <div style={{
          marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {LESSON_POINTS.map((pt, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '11px 14px',
            }}>
              <span style={{ fontSize: 18 }}>{pt.icon}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{pt.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: ROB Quick Help */}
      <div style={{
        background: 'linear-gradient(145deg, #0F0B1C, #12121A)',
        border: '1px solid rgba(0,212,255,0.22)',
        borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <RobCharacter
            size="small"
            emotion={activeResponse ? 'happy' : 'idle'}
            color={robColor}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>
              {robName} Quick Help
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>
              Ask me anything!
            </div>
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          <div style={{
            fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600,
          }}>
            Need help? Tap a button:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {[
              { key: 'timetable', label: '⏰ Make My Timetable', color: 'rgba(123,63,228,0.15)', border: 'rgba(123,63,228,0.35)', text: '#9B6FF4' },
              { key: 'prompt', label: '💡 Explain Prompts', color: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.3)', text: '#00D4FF' },
              { key: 'example', label: '🌟 Give Me an Example', color: 'rgba(255,122,47,0.1)', border: 'rgba(255,122,47,0.3)', text: '#FF7A2F' },
            ].map(btn => (
              <button
                key={btn.key}
                onClick={() => setActiveResponse(activeResponse === btn.key ? null : btn.key)}
                style={{
                  background: activeResponse === btn.key ? btn.color : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeResponse === btn.key ? btn.border : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12, padding: '11px 14px',
                  color: activeResponse === btn.key ? btn.text : 'var(--text-secondary)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Response card */}
          {activeResponse && ROB_RESPONSES[activeResponse] && (
            <div style={{
              background: 'rgba(0,212,255,0.07)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 14, padding: '14px',
              animation: 'slideUpFade 0.3s ease',
            }}>
              <div style={{
                fontSize: 12, fontWeight: 800, color: '#00D4FF', marginBottom: 6,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {ROB_RESPONSES[activeResponse].emoji} {robName} says:
              </div>
              <div style={{
                fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.65,
              }}>
                {ROB_RESPONSES[activeResponse].text}
              </div>
            </div>
          )}

          {!activeResponse && (
            <div style={{
              textAlign: 'center', padding: '20px 0',
              color: 'var(--text-muted)', fontSize: 12,
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>💬</div>
              Tap a button above to get help!
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
