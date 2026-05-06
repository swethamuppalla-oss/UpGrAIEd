import { useEditMode } from '../../../context/EditModeContext';

/**
 * Wraps an array of items with add/remove controls in edit mode.
 *
 * renderItem(item, index, onItemChange?) → ReactNode
 *   onItemChange(patch) is only provided in edit mode; use optional chaining inside.
 */
export default function EditableList({ items = [], onChange, renderItem, emptyItem = {} }) {
  const { editMode, isAdmin } = useEditMode();

  const inEdit = editMode && isAdmin;

  const onItemChange = (i, patch) => {
    const next = items.map((item, idx) => idx === i ? { ...item, ...patch } : item);
    onChange?.(next);
  };

  return (
    <>
      {items.map((item, i) => (
        <div key={i} style={{ position: 'relative' }}>
          {renderItem(item, i, inEdit ? (patch) => onItemChange(i, patch) : undefined)}

          {inEdit && (
            <button
              onClick={() => onChange?.(items.filter((_, idx) => idx !== i))}
              title="Remove item"
              style={{
                position: 'absolute', top: 8, right: 8,
                width: 24, height: 24, borderRadius: '50%',
                border: 'none',
                background: 'rgba(239,68,68,0.12)',
                color: '#EF4444',
                cursor: 'pointer',
                fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          )}
        </div>
      ))}

      {inEdit && (
        <button
          onClick={() => onChange?.([...items, { ...emptyItem }])}
          style={{
            marginTop: 12,
            padding: '7px 18px',
            background: 'rgba(110,220,95,0.08)',
            border: '1px dashed rgba(110,220,95,0.4)',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: '#2A7A20',
            fontFamily: 'inherit',
          }}
        >
          + Add item
        </button>
      )}
    </>
  );
}
