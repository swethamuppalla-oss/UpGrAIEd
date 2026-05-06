import { useState, useEffect } from 'react';
import { useAdminMode } from '../../hooks/useAdminMode';
import './EditableText.scss';

export default function EditableText({
  value,
  onSave,
  multiline = false,
  maxLength,
  className = '',
  as: Tag = 'span',
}) {
  const { isAdmin }       = useAdminMode();
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!isAdmin) { setDraft(value); setEditing(false); }
  }, [value, isAdmin]);

  if (!isAdmin) {
    return <Tag className={`et__view ${className}`}>{value}</Tag>;
  }

  // Admin idle: show text with hover affordance, click to enter edit mode
  if (!editing) {
    return (
      <Tag
        className={`et__view editable-active ${className}`}
        onClick={() => setEditing(true)}
      >
        {value}
      </Tag>
    );
  }

  const handleBlur = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    else setDraft(value);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') e.target.blur();
    if (e.key === 'Escape') { setDraft(value); e.target.blur(); }
  };

  const limit = maxLength ?? (multiline ? 500 : 140);

  return (
    <span className={`et ${className}`}>
      <span className="et__edit-wrap">
        <span className="et__indicator">✏ editing</span>
        {multiline ? (
          <textarea
            className="et__textarea"
            value={draft}
            maxLength={limit}
            rows={3}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <input
            type="text"
            className="et__input"
            value={draft}
            maxLength={limit}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        )}
      </span>
    </span>
  );
}
