import { useEffect, useState } from 'react';
import { evaluateAnswer, evaluateLongAnswer, generateQuestion } from '../../services/api';
import QuestionCard from './QuestionCard';
import AnswerInput from './AnswerInput';
import ImageUploadInput from './ImageUploadInput';
import FeedbackBox from './FeedbackBox';
import ActionBar from './ActionBar';
import './Practice.scss';

export default function Practice({ conceptId }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [inputMode, setInputMode] = useState('type'); // 'type' | 'photo'

  useEffect(() => {
    loadQuestion('normal', null);
  }, [conceptId]);

  const loadQuestion = async (mode, previousQuestionId, mistakeType) => {
    setLoading(true);
    setError(null);
    try {
      const q = await generateQuestion({ conceptId, mode, previousQuestionId, mistakeType });
      setQuestion(q);
      setAnswer('');
      setFeedback(null);
    } catch {
      setError('Could not load a question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode) => {
    if (feedback) return;
    setInputMode(mode);
    setAnswer('');
  };

  const handleSubmit = async () => {
    if (!question) return;
    setSubmitting(true);
    try {
      let res;
      if (inputMode === 'photo') {
        const raw = await evaluateLongAnswer({ questionId: question.id, answer });
        res = {
          correct: raw.isCorrect,
          explanation: raw.feedback,
          score: raw.score,
          strengths: raw.strengths,
          improvements: raw.improvements,
          nextMode: raw.nextMode,
          mistakeType: raw.mistakeType,
        };
      } else {
        res = await evaluateAnswer({ questionId: question.id, answer });
      }
      setFeedback(res);
      setWrongStreak(res.correct ? 0 : (s) => s + 1);
    } catch {
      setError('Could not evaluate your answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    let mode;
    if (feedback?.correct) {
      mode = 'harder';
    } else if (wrongStreak >= 2) {
      mode = 'targeted';
    } else {
      mode = 'similar';
    }
    loadQuestion(mode, question?.id, feedback?.mistakeType ?? null);
  };

  if (error) {
    return (
      <div className="practice__error">
        <p>{error}</p>
        <button className="practice__btn" onClick={() => loadQuestion('normal', null)}>
          Try Again
        </button>
      </div>
    );
  }

  if (loading && !question) {
    return <div className="practice__loading">Loading question…</div>;
  }

  const stateModifier = submitting ? 'submitting' : loading ? 'loading' : feedback ? 'disabled' : '';

  return (
    <main className={`practice${stateModifier ? ` practice--${stateModifier}` : ''}`}>
      <QuestionCard question={question?.text} />

      <div className="practice__mode-toggle" aria-label="Answer input mode">
        <button
          type="button"
          className={`practice__mode-btn${inputMode === 'type' ? ' practice__mode-btn--active' : ''}`}
          onClick={() => switchMode('type')}
          disabled={Boolean(feedback)}
        >
          ✏️ Type
        </button>
        <button
          type="button"
          className={`practice__mode-btn${inputMode === 'photo' ? ' practice__mode-btn--active' : ''}`}
          onClick={() => switchMode('photo')}
          disabled={Boolean(feedback)}
        >
          📷 Photo
        </button>
      </div>

      {inputMode === 'type' ? (
        <AnswerInput
          value={answer}
          onChange={setAnswer}
          disabled={Boolean(feedback) || loading}
        />
      ) : (
        <ImageUploadInput
          key={question?.id}
          answer={answer}
          onAnswer={setAnswer}
          disabled={Boolean(feedback) || loading}
        />
      )}

      <FeedbackBox
        correct={feedback?.correct}
        explanation={feedback?.explanation}
        score={feedback?.score}
        strengths={feedback?.strengths}
        improvements={feedback?.improvements}
      />

      <ActionBar
        canSubmit={answer.trim().length > 0 && !submitting && !loading}
        hasFeedback={Boolean(feedback)}
        onSubmit={handleSubmit}
        onNext={nextQuestion}
      />
    </main>
  );
}
