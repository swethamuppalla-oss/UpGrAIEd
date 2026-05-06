import React from 'react';

const QUESTIONS = [
  "Explain gravity like I'm 10",
  'What is AI in simple terms?',
  'Why do we have seasons?',
  'How does the internet work?',
];

export default function QuickQuestions() {
  const handleClick = (q) => {
    window.location.href = `/ask?q=${encodeURIComponent(q)}`;
  };

  return (
    <div className="question-grid">
      {QUESTIONS.map((q, i) => (
        <button key={i} onClick={() => handleClick(q)}>
          {q}
        </button>
      ))}
    </div>
  );
}
