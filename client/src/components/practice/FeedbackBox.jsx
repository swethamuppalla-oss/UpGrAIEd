export default function FeedbackBox({ correct, explanation, score, strengths, improvements }) {
  if (correct === undefined || correct === null) return null;

  const isRich = score !== undefined;

  return (
    <div className={`practice__feedback practice__feedback--${correct ? 'correct' : 'wrong'}`}>
      {isRich && (
        <div className="practice__feedback-score">
          <span className="practice__feedback-score-value">{score}</span>
          <span className="practice__feedback-score-label">/ 100</span>
        </div>
      )}

      <p className="practice__feedback-title">
        {correct ? '✓ Great work!' : '→ Keep going!'}
      </p>
      <p className="practice__feedback-body">{explanation}</p>

      {isRich && strengths?.length > 0 && (
        <div className="practice__feedback-section practice__feedback-section--good">
          <p className="practice__feedback-section-label">What you got right</p>
          <ul className="practice__feedback-list">
            {strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {isRich && improvements?.length > 0 && (
        <div className="practice__feedback-section practice__feedback-section--tip">
          <p className="practice__feedback-section-label">To improve</p>
          <ul className="practice__feedback-list">
            {improvements.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
