const MOCK = {
  concept: 'Better Questions, Better Answers',
  progress: 42,
}

export default function ContinueLearningCard({
  concept = MOCK.concept,
  progress = MOCK.progress,
  onResume,
}) {
  return (
    <div className="sd-continue">
      <div className="sd-continue__glow" />

      <p className="sd-continue__eyebrow">Continue Learning</p>

      <h2 className="sd-continue__title">{concept}</h2>

      <div className="sd-continue__progress-row">
        <span>Overall progress</span>
        <span>{progress}%</span>
      </div>

      <div className="sd-continue__bar">
        <div style={{ width: `${Math.max(progress, 0)}%` }} />
      </div>

      <button type="button" className="sd-continue__btn" onClick={onResume}>
        <span>Resume Today's Lesson</span>
        <span>→</span>
      </button>
    </div>
  )
}
