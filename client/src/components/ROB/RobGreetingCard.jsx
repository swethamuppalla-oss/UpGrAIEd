import { useEffect, useState } from 'react'
import { useROB } from '../../context/RobContext'
import RobCharacter from './RobCharacter'
import RobBubble from './RobBubble'
import { getRobMood, ROB_COLORS } from '../../utils/RobMoodEngine'
import { useConfigValue } from '../../hooks/useConfigValue'

export default function RobGreetingCard({ onQuickRecap, onContinueMission, onMiniGame, onScrollToQuiz, onScrollToGame, streak, badges }) {
  const { robName, robColor, robLevel, companionData, xpToday, levelProgress, nextLevelXP } = useROB()
  const personality  = useConfigValue('bloom.personality', null)
  const displayName  = robName || 'ROB'
  const [mood, setMood] = useState(getRobMood(companionData, xpToday, 100, personality))
  const [bubbleVisible, setBubbleVisible] = useState(true)

  const colors = ROB_COLORS[robColor] || ROB_COLORS.cyan

  useEffect(() => {
    setMood(getRobMood(companionData, xpToday, 100, personality))
  }, [companionData, xpToday, personality])

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbleVisible(false)
      setTimeout(() => setBubbleVisible(true), 500)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  const greetWord = mood.emotion === 'sleepy' ? 'Good night,' :
    mood.emotion === 'celebrating' ? 'Incredible work,' :
    mood.emotion === 'encouraging' ? 'Welcome back,' :
    'Hello,'

  const xpNeeded = Math.max(0, (nextLevelXP || 0) - (xpToday || 0))

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
          grid-template-columns: 1fr 320px;
          gap: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: dashboardRise 0.8s cubic-bezier(0.34,1.56,0.64,1);
          margin-bottom: 28px;
        }
        @media (max-width: 900px) {
          .greeting-card {
            grid-template-columns: 1fr;
          }
          .greeting-card .rob-showcase {
            display: none;
          }
        }
        .greeting-action {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 13px 16px;
          text-align: left;
          cursor: pointer;
          transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: inherit;
        }
        .greeting-action:hover {
          background: rgba(255,255,255,0.07);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .greeting-action.primary {
          background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          border: 1px solid ${colors.glow};
        }
        .greeting-action.primary:hover {
          background: linear-gradient(135deg, ${colors.glow}, rgba(255,255,255,0.04));
          box-shadow: 0 10px 40px ${colors.glow};
        }
        .rob-showcase {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 24px;
          background: radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%);
        }
        .stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 13px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .comeback-banner {
          background: linear-gradient(90deg, #FF5C28, #EC4899);
          color: white;
          padding: 7px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
      `}</style>

      <section className="greeting-card">
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '50%', height: '140%',
          background: `radial-gradient(ellipse at center, ${colors.glow} 0%, transparent 60%)`,
          opacity: 0.12, filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div style={{ padding: '40px 36px', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {companionData?.comebackRecap && (
            <div className="comeback-banner">⚠️ Time for a Recap!</div>
          )}

          <div className="clash-display" style={{ fontSize: 38, marginBottom: 6, lineHeight: 1.1 }}>
            {greetWord} <span style={{ color: colors.primary }}>{companionData?.userName || 'Explorer'}!</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 20, maxWidth: 480, lineHeight: 1.6 }}>
            <strong style={{ color: 'white' }}>{displayName}</strong> is ready!{' '}
            {xpNeeded > 0
              ? <>You need <strong style={{ color: '#FFD700' }}>{xpNeeded} more XP</strong> to reach Level {robLevel + 1}.</>
              : <>You hit your XP goal today! 🎉</>
            }
          </p>

          {/* Stats pills */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            <span className="stat-pill">🔥 {companionData?.streak || streak || 0} day streak</span>
            <span className="stat-pill">⚡ {xpToday || 0} XP today</span>
            <span className="stat-pill">🏆 {badges?.length || 0} badges</span>
            <span className="stat-pill">⭐ Level {robLevel}</span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <button type="button" className="greeting-action primary" onClick={onContinueMission}>
              <span style={{ fontSize: 20 }}>🚀</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 1 }}>Continue</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Learning</div>
              </div>
            </button>

            <button type="button" className="greeting-action" onClick={onScrollToQuiz || onQuickRecap}>
              <span style={{ fontSize: 20 }}>🧠</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 1 }}>Quick</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Quiz</div>
              </div>
            </button>

            <button type="button" className="greeting-action" onClick={onScrollToGame || onMiniGame}>
              <span style={{ fontSize: 20 }}>🕹️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 1 }}>Play</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Game</div>
              </div>
            </button>
          </div>
        </div>

        <div className="rob-showcase">
          <div style={{ position: 'relative' }}>
            <RobBubble message={mood.message} visible={bubbleVisible} />
            <RobCharacter
              size="hero"
              emotion={mood.emotion}
              robColor={robColor}
              chestName={displayName}
              level={robLevel}
              chestProgress={levelProgress}
            />
          </div>
        </div>
      </section>
    </>
  )
}
