import Bloom from '../Bloom/Bloom'
import RobQuizPanel from '../ROB/RobQuizPanel'
import RobGamePanel from '../ROB/RobGamePanel'
import Header from './Header'
import ContinueCard from './ContinueCard'
import ProgressCard from './ProgressCard'
import WeakAreas from './WeakAreas'
import QuickActions from './QuickActions'

export default function Dashboard({
  // header
  firstName,
  streak,
  grade,
  // continue card
  concept,
  progress,
  // stats
  stats,
  // weak areas
  weakAreas,
  conceptsDone,
  // bloom
  bloomEmotion,
  bloomMessage,
  bloomVariant,
  robLevel,
  robXP,
  badges,
  // actions
  onResume,
  onPractice,
  onQuiz,
  onDrill,
  onRevisit,
  // panel refs
  quizPanelRef,
  gamePanelRef,
  moduleId,
}) {
  return (
    <div className="sd">
      <Header
        firstName={firstName}
        streak={streak}
        grade={grade}
        emotion={bloomEmotion}
      />

      <ContinueCard
        concept={concept}
        progress={progress}
        onResume={onResume}
      />

      <ProgressCard stats={stats} />

      <WeakAreas
        areas={weakAreas}
        conceptsDone={conceptsDone}
        onPractice={onPractice}
      />

      <QuickActions
        onQuiz={onQuiz}
        onDrill={onDrill}
        onRevisit={onRevisit}
      />

      <div className="sd-bloom">
        <Bloom variant={bloomVariant} size={80} emotion={bloomEmotion} style={{ flexShrink: 0 }} />
        <div className="sd-bloom__text">
          <p className="sd-bloom__eyebrow">Bloom says</p>
          <p className="sd-bloom__message">{bloomMessage}</p>
          <div className="sd-bloom__meta">
            <span>⭐ Level {robLevel}</span>
            <span>{robXP} XP total</span>
            {badges > 0 && <span>🏆 {badges} badge{badges > 1 ? 's' : ''}</span>}
          </div>
        </div>
      </div>

      <section className="dashboard-grid student-quiz-game-grid">
        <div ref={quizPanelRef}><RobQuizPanel currentModuleId={moduleId} /></div>
        <div ref={gamePanelRef}><RobGamePanel /></div>
      </section>
    </div>
  )
}
