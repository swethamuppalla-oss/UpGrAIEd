import { useState } from 'react';

export default function CheckpointTyped({ point, onSubmit, loading }) {
  const [value, setValue] = useState('');
  const canSubmit = value.trim().length > 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Type your answer here…"
        rows={3}
        style={{
          width: '100%', padding: '14px 16px', borderRadius: 14,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
          color: '#fff', fontSize: 14, lineHeight: 1.6, resize: 'none',
          outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(110,220,95,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.14)'}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          {value.trim().length} chars · share your thinking
        </span>
        <button
          disabled={!canSubmit || loading}
          onClick={() => onSubmit(value.trim())}
          style={{
            padding: '11px 24px', borderRadius: 22,
            background: canSubmit ? 'linear-gradient(135deg,#6EDC5F,#3DAA3A)' : 'rgba(255,255,255,0.06)',
            color: canSubmit ? '#0A1F12' : 'rgba(255,255,255,0.2)',
            border: 'none', fontSize: 13, fontWeight: 700,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {loading ? '⏳ Checking…' : 'Submit →'}
        </button>
      </div>
    </div>
  );
}
