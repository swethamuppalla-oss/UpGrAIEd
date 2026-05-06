import { useState } from 'react';
import { useEditMode } from '../../../context/EditModeContext';

export default function EditableImage({ src, alt = '', onChange, style, className }) {
  const { editMode, isAdmin } = useEditMode();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(src || '');

  if (!editMode || !isAdmin) {
    return src
      ? <img src={src} alt={alt} style={style} className={className} />
      : null;
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      {src ? (
        <img src={src} alt={alt} style={{ ...style, opacity: 0.85 }} className={className} />
      ) : (
        <div style={{
          ...style,
          minHeight: 120,
          background: 'rgba(110,220,95,0.06)',
          border: '2px dashed rgba(110,220,95,0.35)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4B6B57',
          fontSize: 13,
        }}>
          No image — click to set
        </div>
      )}

      {open ? (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(255,255,255,0.97)',
          border: '1px solid rgba(110,220,95,0.25)',
          borderRadius: '0 0 10px 10px',
          padding: 10,
          display: 'flex', gap: 8,
          boxShadow: '0 4px 16px rgba(10,31,18,0.1)',
        }}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Paste image URL…"
            style={{
              flex: 1, padding: '6px 10px',
              border: '1px solid rgba(110,220,95,0.3)', borderRadius: 6,
              fontSize: 13, outline: 'none', fontFamily: 'inherit',
            }}
          />
          <button
            onClick={() => { onChange?.(draft); setOpen(false); }}
            style={{
              padding: '6px 14px',
              background: '#6EDC5F', border: 'none', borderRadius: 6,
              cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#0D2010',
            }}
          >
            Set
          </button>
          <button
            onClick={() => setOpen(false)}
            style={{
              padding: '6px 10px',
              background: 'transparent', border: '1px solid #ddd', borderRadius: 6,
              cursor: 'pointer', fontSize: 13,
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setDraft(src || ''); setOpen(true); }}
          style={{
            position: 'absolute', top: 8, right: 8,
            padding: '4px 10px',
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(110,220,95,0.3)',
            borderRadius: 6, cursor: 'pointer', fontSize: 12,
          }}
        >
          ✏️ Change
        </button>
      )}
    </div>
  );
}
