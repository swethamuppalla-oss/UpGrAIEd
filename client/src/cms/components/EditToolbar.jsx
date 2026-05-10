import { useEffect, useState } from 'react'
import { useCMS } from '../hooks/useCMS'
import { useEditMode } from '../../context/EditModeContext'

const STYLES = `
  @keyframes cms-slide-up {
    from { opacity: 0; transform: translateY(16px) scale(0.94); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }
  @keyframes cms-dot-pulse {
    0%, 100% { box-shadow: 0 0 6px currentColor; }
    50%       { box-shadow: 0 0 14px currentColor, 0 0 28px currentColor; }
  }
`

function injectStyles() {
  if (document.getElementById('cms-toolbar-kf')) return
  const tag = document.createElement('style')
  tag.id = 'cms-toolbar-kf'
  tag.textContent = STYLES
  document.head.appendChild(tag)
}

export default function EditToolbar() {
  const { isAdmin, isSaving } = useCMS()
  const { editMode, enterEditMode, discardDraft } = useEditMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    injectStyles()
    if (!isAdmin) return
    const t = setTimeout(() => setMounted(true), 600)
    return () => clearTimeout(t)
  }, [isAdmin])

  if (!isAdmin || !mounted) return null

  const dotColor = editMode ? '#6EDC5F' : '#7B3FE4'

  return (
    <div
      role="toolbar"
      aria-label="CMS Edit Mode"
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(6, 3, 18, 0.9)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: `1px solid ${editMode ? 'rgba(110,220,95,0.45)' : 'rgba(139,92,246,0.35)'}`,
        borderRadius: 18,
        padding: '12px 20px',
        boxShadow: editMode
          ? '0 8px 40px rgba(110,220,95,0.14), 0 0 0 1px rgba(110,220,95,0.08)'
          : '0 8px 40px rgba(139,92,246,0.18), 0 0 0 1px rgba(139,92,246,0.06)',
        animation: 'cms-slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        transition: 'border-color 0.4s, box-shadow 0.4s',
        userSelect: 'none',
      }}
    >
      {/* Status dot */}
      <div style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: dotColor,
        color: dotColor,
        flexShrink: 0,
        animation: editMode ? 'cms-dot-pulse 2s ease-in-out infinite' : 'none',
        transition: 'background 0.4s',
        boxShadow: `0 0 8px ${dotColor}`,
      }} />

      {/* Label */}
      <span style={{
        color: editMode ? '#C6F8C0' : '#C4B5FD',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.4px',
        whiteSpace: 'nowrap',
        transition: 'color 0.4s',
        fontFamily: 'system-ui, sans-serif',
      }}>
        {editMode
          ? isSaving ? 'Saving…' : 'Edit Mode'
          : 'Admin'}
      </span>

      {/* Divider */}
      <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

      {/* Action button */}
      {editMode ? (
        <button
          onClick={discardDraft}
          title="Exit edit mode"
          style={{
            background: 'rgba(239,68,68,0.12)',
            color: '#FCA5A5',
            border: '1px solid rgba(239,68,68,0.28)',
            borderRadius: 9,
            padding: '5px 15px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: 'system-ui, sans-serif',
            transition: 'background 0.15s, color 0.15s',
            letterSpacing: '0.3px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.24)'
            e.currentTarget.style.color = '#FEE2E2'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.12)'
            e.currentTarget.style.color = '#FCA5A5'
          }}
        >
          Exit Edit Mode
        </button>
      ) : (
        <button
          onClick={enterEditMode}
          title="Enter edit mode"
          style={{
            background: 'linear-gradient(135deg, rgba(123,63,228,0.85) 0%, rgba(155,89,232,0.85) 100%)',
            color: '#F3E8FF',
            border: 'none',
            borderRadius: 9,
            padding: '5px 15px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: 'system-ui, sans-serif',
            boxShadow: '0 2px 14px rgba(139,92,246,0.38)',
            letterSpacing: '0.3px',
            transition: 'background 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #7B3FE4 0%, #9B59E8 100%)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.55)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(123,63,228,0.85) 0%, rgba(155,89,232,0.85) 100%)'
            e.currentTarget.style.boxShadow = '0 2px 14px rgba(139,92,246,0.38)'
          }}
        >
          Enter Edit Mode
        </button>
      )}
    </div>
  )
}
