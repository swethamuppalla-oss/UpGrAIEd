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

  const typeColors = {
    success: { bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.4)',   text: '#22C55E' },
    error:   { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   text: '#EF4444' },
    info:    { bg: 'rgba(123,63,228,0.15)',   border: 'rgba(123,63,228,0.4)',  text: '#9B6FF4' },
    warning: { bg: 'rgba(255,122,47,0.15)',  border: 'rgba(255,122,47,0.4)',  text: '#FF7A2F' },
  }

  const typeIcons = { success: '✓', error: '✗', info: 'ℹ', warning: '⚠' }

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 24,
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
      }}>
        {toasts.map(toast => {
          const colors = typeColors[toast.type] || typeColors.info
          return (
            <div
              key={toast.id}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                animation: 'slideUp 0.3s ease',
                pointerEvents: 'auto',
                cursor: 'pointer',
                minWidth: 240,
                maxWidth: 400,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
              onClick={() => removeToast(toast.id)}
            >
              <span style={{ color: colors.text, fontWeight: 700, fontSize: 16, lineHeight: 1 }}>
                {typeIcons[toast.type]}
              </span>
              <span style={{ color: 'var(--text-primary)', fontSize: 14, flex: 1 }}>
                {toast.message}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>✕</span>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastProvider
