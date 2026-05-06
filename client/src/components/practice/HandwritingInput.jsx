import { useState } from "react";
import { uploadImage, evaluateLongAnswer } from "../../services/api";

const PHASE = {
  IDLE: "idle",
  EXTRACTING: "extracting",
  PREVIEW: "preview",
  SUBMITTING: "submitting",
  FEEDBACK: "feedback",
};

export default function HandwritingInput({ conceptId, onComplete }) {
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setPhase(PHASE.EXTRACTING);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadImage(formData);
      setText(res.extractedText);
      setPhase(PHASE.PREVIEW);
    } catch (err) {
      setError(err.message || "Could not read image. Try a clearer photo.");
      setPhase(PHASE.IDLE);
    }
  }

  async function handleSubmit() {
    setError(null);
    setPhase(PHASE.SUBMITTING);

    try {
      const result = await evaluateLongAnswer({ text, conceptId });
      setFeedback(result);
      setPhase(PHASE.FEEDBACK);
      onComplete?.(result);
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
      setPhase(PHASE.PREVIEW);
    }
  }

  function reset() {
    setText("");
    setFeedback(null);
    setError(null);
    setPhase(PHASE.IDLE);
  }

  if (phase === PHASE.IDLE) {
    return (
      <div>
        {error && <p>{error}</p>}
        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>
    );
  }

  if (phase === PHASE.EXTRACTING) {
    return <p>Reading your image…</p>;
  }

  if (phase === PHASE.PREVIEW) {
    return (
      <div>
        {error && <p>{error}</p>}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={reset}>Start over</button>
      </div>
    );
  }

  if (phase === PHASE.SUBMITTING) {
    return <p>Marking your answer…</p>;
  }

  return (
    <div>
      <p>
        {feedback.score} / {feedback.total}
      </p>
      {feedback.feedback.length > 0 && (
        <ul>
          {feedback.feedback.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}
      <button onClick={reset}>Try again</button>
    </div>
  );
}
