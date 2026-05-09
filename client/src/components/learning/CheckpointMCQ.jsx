import { useState } from 'react';


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
