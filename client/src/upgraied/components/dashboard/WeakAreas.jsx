import './WeakAreas.scss';

const SEVERITY = {
  high:   { color: '#EF4444', label: 'Needs work' },
  medium: { color: '#F97316', label: 'Review soon' },
  low:    { color: '#F59E0B', label: 'Minor gap'  },
};

export default function WeakAreas({ areas }) {
  return (
    <div className="wa">
      <p className="wa__title">Weak Areas</p>
      <ul className="wa__list">
        {areas.map(({ topic, severity }) => {
          const { color, label } = SEVERITY[severity];
          return (
            <li key={topic} className="wa__item">
              <span className="wa__dot" style={{ background: color }} />
              <span className="wa__topic">{topic}</span>
              <span className="wa__badge" style={{ color, borderColor: `${color}30` }}>
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
