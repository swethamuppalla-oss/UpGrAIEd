/**
 * Purple glow outline that appears on hover over editable elements.
 * Rendered as an absolute overlay — parent must have position: relative.
 */
export default function EditOutline({ visible, label = 'Edit', onEdit }) {
  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: -2,
        borderRadius: 6,
        border: '1.5px solid rgba(139,92,246,0.65)',
        boxShadow:
          '0 0 0 3px rgba(139,92,246,0.1), 0 0 18px rgba(139,92,246,0.18)',
        pointerEvents: 'none',
        zIndex: 10,
        transition: 'opacity 0.15s',
      }}
    >
      <button
        onMouseDown={e => e.stopPropagation()}
        onClick={e => { e.stopPropagation(); onEdit?.() }}
        style={{
          position: 'absolute',
          top: 0,
          right: 6,
          transform: 'translateY(-100%)',
          background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
          color: '#F3E8FF',
          border: 'none',
          borderRadius: '4px 4px 0 0',
          padding: '2px 10px',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          pointerEvents: 'all',
          boxShadow: '0 -2px 8px rgba(139,92,246,0.28)',
          fontFamily: 'system-ui, sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        ✏ {label}
      </button>
    </div>
  )
}
