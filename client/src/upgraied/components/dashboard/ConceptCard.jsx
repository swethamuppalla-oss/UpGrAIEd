import './ConceptCard.scss';

export default function ConceptCard({ concept }) {
  const { title, chapter, progress, day, totalDays } = concept;

  return (
    <div className="cc">
      <div className="cc__top">
        <span className="cc__tag">Current Concept</span>
        <span className="cc__day">Day {day} / {totalDays}</span>
      </div>

      <h2 className="cc__title">{title}</h2>
      <p className="cc__chapter">{chapter}</p>

      <div className="cc__progress-wrap">
        <div className="cc__progress-bar">
          <div className="cc__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="cc__progress-pct">{progress}%</span>
      </div>

      <button className="cc__btn">Continue Learning →</button>
    </div>
  );
}
