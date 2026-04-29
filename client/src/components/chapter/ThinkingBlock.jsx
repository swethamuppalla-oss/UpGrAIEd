import { useState } from 'react';

const ThinkingBlock = ({ section, onContinue }) => {
  const [input, setInput] = useState("");

  return (
    <div className="ui-card" style={{ marginBottom: '24px' }}>
      <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
        {section.prompt}
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="input-field"
        style={{ minHeight: '120px', marginBottom: '16px', resize: 'vertical' }}
        placeholder="Type your thoughts here..."
      />

      <button className="ui-button-primary" onClick={onContinue} disabled={!input.trim()}>Continue</button>
    </div>
  );
};

export default ThinkingBlock;
