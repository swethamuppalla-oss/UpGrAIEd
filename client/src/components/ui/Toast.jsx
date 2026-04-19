import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const typeStyles = {
    success: { border: '1px solid rgba(34,197,94,0.4)',   color: '#22C55E',  icon: '✓' },
    error:   { border: '1px solid rgba(239,68,68,0.4)',   color: '#EF4444',  icon: '✗' },
    info:    { border: '1px solid rgba(123,63,228,0.4)',  color: '#9B6FF4',  icon: 'ℹ' },
    warning: { border: '1px solid rgba(255,122,47,0.4)', color: '#FF7A2F',  icon: '⚠' },
  }

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
          const s = typeStyles[toast.type] || typeStyles.info
          return (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              style={{
                background: '#171228',
                borderRadius: 12,
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                pointerEvents: 'auto',
                cursor: 'pointer',
                minWidth: 240,
                maxWidth: 400,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                animation: 'slideUp 0.3s ease',
                border: s.border,
                color: s.color,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 15, lineHeight: 1 }}>{s.icon}</span>
              <span style={{ color: '#F0F0FF', fontSize: 14, flex: 1 }}>{toast.message}</span>
              <span style={{ color: '#555577', fontSize: 12 }}>✕</span>
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
