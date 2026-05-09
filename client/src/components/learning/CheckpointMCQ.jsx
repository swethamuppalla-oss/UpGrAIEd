import { useState } from 'react';

/* ─── MCQ Option Button ──────────────────────────────────────── */
function MCQOption({ label, selected, correct, revealed, onClick }) {
  let bg = 'rgba(255,255,255,0.05)';
  let border = '1px solid rgba(255,255,255,0.12)';
  let color = 'rgba(255,255,255,0.8)';

  if (revealed) {
    if (correct) { bg = 'rgba(110,220,95,0.15)'; border = '1px solid rgba(110,220,95,0.5)'; color = '#6EDC5F'; }
    else if (selected) { bg = 'rgba(239,68,68,0.12)'; border = '1px solid rgba(239,68,68,0.4)'; color = '#F87171'; }
  } else if (selected) {
    bg = 'rgba(110,220,95,0.12)'; border = '1px solid rgba(110,220,95,0.4)'; color = '#A8F5A2';
  }

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      style={{
        width: '100%', padding: '12px 16px', borderRadius: 12,
        background: bg, border, color,
        fontSize: 14, fontWeight: 500, cursor: revealed ? 'default' : 'pointer',
        textAlign: 'left', transition: 'all 0.15s',
        display: 'flex', alignItems: 'center', gap: 10,
      }}
      onMouseEnter={e => { if (!revealed && !selected) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
      onMouseLeave={e => { if (!revealed && !selected) e.currentTarget.style.background = bg; }}
    >
      {revealed && correct && <span style={{ fontSize: 16 }}>✅</span>}
      {revealed && selected && !correct && <span style={{ fontSize: 16 }}>❌</span>}
      {!revealed && <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{label}</span>}
      <span style={{ flex: 1 }}>{label === 'A' || label === 'B' || label === 'C' || label === 'D' ? null : label}</span>
    </button>
  );
}

/* ─── Main MCQ Panel ─────────────────────────────────────────── */
export default function CheckpointMCQ({ point, onSubmit, loading }) {
  const [selected, setSelected] = useState(null);
  const LABELS = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {point.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(opt)}
            style={{
              padding: '12px 14px', borderRadius: 12,
              background: selected === opt ? 'rgba(110,220,95,0.12)' : 'rgba(255,255,255,0.05)',
              border: selected === opt ? '1px solid rgba(110,220,95,0.45)' : '1px solid rgba(255,255,255,0.1)',
              color: selected === opt ? '#A8F5A2' : 'rgba(255,255,255,0.75)',
              fontSize: 13, fontWeight: selected === opt ? 600 : 400,
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { if (selected !== opt) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { if (selected !== opt) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          >
            <span style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, background: selected === opt ? 'rgba(110,220,95,0.2)' : 'rgba(255,255,255,0.08)', color: selected === opt ? '#6EDC5F' : 'rgba(255,255,255,0.4)' }}>
              {LABELS[i]}
            </span>
            {opt}
          </button>
        ))}
      </div>

      <button
        disabled={!selected || loading}
        onClick={() => onSubmit(selected)}
        style={{
          marginTop: 4, padding: '13px', borderRadius: 14,
          background: selected ? 'linear-gradient(135deg,#6EDC5F,#3DAA3A)' : 'rgba(255,255,255,0.06)',
          color: selected ? '#0A1F12' : 'rgba(255,255,255,0.25)',
          border: 'none', fontSize: 14, fontWeight: 700,
          cursor: selected ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
        }}
      >
        {loading ? '⏳ Checking…' : 'Submit Answer →'}
      </button>
    </div>
  );
}
