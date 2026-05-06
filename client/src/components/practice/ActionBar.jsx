export default function ActionBar({ canSubmit, hasFeedback, onSubmit, onNext }) {
  return (
    <div className="practice__actions">
      {!hasFeedback ? (
        <button
          type="button"
          className="practice__btn"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          Submit
        </button>
      ) : (
        <button type="button" className="practice__btn" onClick={onNext}>
          Next Question →
        </button>
      )}
    </div>
  );
}
