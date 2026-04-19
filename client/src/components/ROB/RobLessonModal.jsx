export default function RobLessonModal({ open, onClose, children }) {
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: 'rgba(5, 8, 16, 0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: 'min(100%, 920px)',
          maxHeight: '92vh',
          overflow: 'hidden',
          borderRadius: 28,
          border: '1px solid rgba(0,212,255,0.2)',
          background: 'linear-gradient(180deg, rgba(16,13,30,0.98), rgba(10,10,15,0.98))',
          boxShadow: '0 28px 80px rgba(0,0,0,0.55)',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-ghost"
          style={{ position: 'absolute', top: 18, right: 18, zIndex: 2 }}
        >
          Close
        </button>
        {children}
      </div>
    </div>
  )
}
