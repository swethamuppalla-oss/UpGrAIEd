const ACTIONS = [
  { key: 'quiz',    icon: '🧠', label: 'Practice Quiz', sub: 'Test yourself',  mod: '--quiz'    },
  { key: 'drill',   icon: '⚡', label: 'Speed Drill',   sub: 'Race the clock', mod: '--drill'   },
  { key: 'revisit', icon: '↩️', label: 'Revisit',       sub: 'Go deeper',      mod: '--revisit' },
]

export default function QuickActions({ onQuiz, onDrill, onRevisit }) {
  const handlers = { quiz: onQuiz, drill: onDrill, revisit: onRevisit }

  return (
    <div className="sd-actions">
      <p className="sd-label">Quick Actions</p>
      <div className="sd-actions__grid">
        {ACTIONS.map(a => (
          <button
            key={a.key}
            type="button"
            className={`sd-actions__btn ${a.mod}`}
            onClick={handlers[a.key]}
          >
            <span className="sd-actions__icon">{a.icon}</span>
            <span className="sd-actions__label">{a.label}</span>
            <span className="sd-actions__sub">{a.sub}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
