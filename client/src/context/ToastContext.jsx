import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }) {
  const typeStyles = {
    success: {
      bg:     'rgba(34, 197, 94, 0.12)',
      border: 'rgba(34, 197, 94, 0.35)',
      text:   '#22C55E',
      icon:   '✓',
    },
    error: {
      bg:     'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.35)',
      text:   '#EF4444',
      icon:   '✕',
    },
    info: {
      bg:     'rgba(123, 63, 228, 0.12)',
      border: 'rgba(123, 63, 228, 0.35)',
      text:   '#9B6FF4',
      icon:   'ℹ',
    },
    warning: {
      bg:     'rgba(255, 122, 47, 0.12)',
      border: 'rgba(255, 122, 47, 0.35)',
      text:   '#FF7A2F',
      icon:   '⚠',
    },
  }

  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        pointerEvents: 'none',
        width: 'max-content',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      {toasts.map(toast => {
        const s = typeStyles[toast.type] || typeStyles.info
        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: 12,
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              animation: 'slideUp 0.3s ease',
              pointerEvents: 'auto',
              cursor: 'pointer',
              minWidth: 240,
              maxWidth: 400,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ color: s.text, fontWeight: 700, fontSize: 15, lineHeight: 1 }}>
              {s.icon}
            </span>
            <span style={{ color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.4 }}>
              {toast.message}
            </span>
            <span
              style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 'auto', paddingLeft: 8 }}
            >
              ✕
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

export default ToastProvider
