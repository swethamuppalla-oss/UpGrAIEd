export default function QuestionCard({ question }) {
  return (
    <section className="practice__question">
      <span className="practice__question-label">Practice Question</span>
      <h1 className="practice__question-text">{question}</h1>
    </section>
  );
}
