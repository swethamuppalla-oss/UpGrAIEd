export default function AnswerInput({ value, onChange, disabled }) {
  return (
    <div className="practice__answer">
      <span className="practice__answer-label">Your answer</span>
      <textarea
        className="practice__textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your thinking here…"
        rows={5}
      />
    </div>
  );
}
