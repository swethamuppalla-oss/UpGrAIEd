const MOCK_STATS = [
  { label: 'Accuracy',      value: '87%',  icon: '🎯', color: '#6EDC5F' },
  { label: 'Concepts Done', value: 12,     icon: '📚', color: '#63C7FF' },
  { label: 'Time Spent',    value: '2h 15m', icon: '⏱️', color: '#A78BFA' },
  { label: 'XP Today',      value: '+150', icon: '⚡', color: '#FFD95A' },
]

export default function ProgressCard({ stats = MOCK_STATS }) {
  return (
    <div className="sd-stats">
      {stats.map(stat => (
        <div key={stat.label} className="sd-stats__card">
          <span className="sd-stats__icon">{stat.icon}</span>
          <span className="sd-stats__value" style={{ color: stat.color }}>{stat.value}</span>
          <span className="sd-stats__label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
