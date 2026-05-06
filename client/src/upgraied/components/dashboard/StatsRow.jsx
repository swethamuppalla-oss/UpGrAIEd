import './StatsRow.scss';

const STATS_META = [
  { key: 'accuracy',     label: 'Accuracy',       icon: '🎯', format: v => `${v}%`,  color: 'green' },
  { key: 'timeSpent',    label: 'Time Spent',      icon: '⏱',  format: v => v,        color: 'blue'  },
  { key: 'conceptsDone', label: 'Concepts Done',   icon: '✅', format: v => v,        color: 'amber' },
];

export default function StatsRow({ stats }) {
  return (
    <div className="sr">
      {STATS_META.map(({ key, label, icon, format, color }) => (
        <div key={key} className={`sr__card sr__card--${color}`}>
          <span className="sr__icon">{icon}</span>
          <span className="sr__value">{format(stats[key])}</span>
          <span className="sr__label">{label}</span>
        </div>
      ))}
    </div>
  );
}
