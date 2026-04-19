import { useEffect, useState } from 'react'
import { useROB } from '../../context/RobContext'
import RobCharacter from './RobCharacter'
import RobBubble from './RobBubble'
import { getRobMood, ROB_COLORS } from '../../utils/RobMoodEngine'

export default function RobGreetingCard({ onQuickRecap, onContinueMission, onMiniGame }) {
  const { robName, robColor, robLevel, companionData, xpToday, levelProgress, nextLevelXP } = useROB()
  const [mood, setMood] = useState(getRobMood(companionData, xpToday))
  const [bubbleVisible, setBubbleVisible] = useState(true)

  const colors = ROB_COLORS[robColor] || ROB_COLORS.cyan
  
  useEffect(() => {
    setMood(getRobMood(companionData, xpToday))
  }, [companionData, xpToday])

  // Rotate thought bubble messages occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbleVisible(false)
      setTimeout(() => {
        setBubbleVisible(true)
      }, 500)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>{`
        .greeting-card {
          position: relative;
          background: linear-gradient(135deg, #130E24 0%, #1A1430 100%);
          border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: dashboardRise 0.8s cubic-bezier(0.34,1.56,0.64,1);
        }
        @media (max-width: 900px) {
          .greeting-card {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }
        .greeting-action {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px 20px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          color: white;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .greeting-action:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .greeting-action.primary {
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
          border: 1px solid ${colors.glow};
        }
        .greeting-action.primary:hover {
          background: ${colors.glow};
          box-shadow: 0 10px 40px ${colors.glow};
        }
        .rob-showcase {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          background: radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%);
        }
        .comeback-banner {
          background: linear-gradient(90deg, #FF5C28, #EC4899);
          color: white;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          animation: robShake 0.5s ease 2s;
        }
      `}</style>

      <section className="greeting-card">
        {/* Glow blob behind left side */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '50%', height: '140%',
          background: `radial-gradient(ellipse at center, ${colors.glow} 0%, transparent 60%)`,
          opacity: 0.15, filter: 'blur(40px)', pointerEvents: 'none'
        }} />

        <div style={{ padding: '48px 40px', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {companionData?.comebackRecap && (
            <div className="comeback-banner">
              ⚠️ Inactivity detected: Time for a Recap!
            </div>
          )}

          <div className="clash-display" style={{ fontSize: 42, marginBottom: 8, lineHeight: 1.1 }}>
            {mood.emotion === 'sleepy' ? 'Good night,' : 
             mood.emotion === 'celebrating' ? 'Incredible work,' :
             mood.emotion === 'encouraging' ? 'Welcome back,' :
             'Hello,'} <span style={{ color: colors.primary }}>{companionData?.userName || 'Explorer'}!</span>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 32, maxWidth: 500, lineHeight: 1.5 }}>
            <strong style={{ color: 'white' }}>{robName || 'ROB'}</strong> says you have a <strong style={{ color: '#FFD700' }}>{companionData?.streak || 0}-day streak</strong>! 
            You need {nextLevelXP - (xpToday || 0)} more XP to reach Level {robLevel + 1}.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
            <button type="button" className="greeting-action primary" onClick={onContinueMission}>
              <div style={{ fontSize: 24, background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 12 }}>🚀</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>Continue Mission</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Jump back in</div>
              </div>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button type="button" className="greeting-action" onClick={onQuickRecap} style={{ padding: '10px 16px' }}>
                <span style={{ fontSize: 18 }}>🧠</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Quick Recap</span>
              </button>
              
              <button type="button" className="greeting-action" onClick={onMiniGame} style={{ padding: '10px 16px' }}>
                <span style={{ fontSize: 18 }}>🕹️</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Play Mini Game</span>
              </button>
            </div>
          </div>
        </div>

        <div className="rob-showcase">
          <div style={{ position: 'relative' }}>
            <RobBubble message={mood.message} visible={bubbleVisible} />
            <RobCharacter 
              size="hero" 
              emotion={mood.emotion} 
              robColor={robColor} 
              chestName={robName}
              level={robLevel}
              chestProgress={levelProgress} 
            />
          </div>
        </div>
      </section>
    </>
  )
}
