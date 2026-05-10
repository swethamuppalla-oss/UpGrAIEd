import { useState, useEffect, useCallback } from 'react'
import { useCMS } from '../hooks/useCMS'
import { parseContentKey } from '../utils/cmsHelpers'

const PURPLE = 'rgba(139,92,246,0.65)'
const GREEN  = '#6EDC5F'

/**
 * Button/link whose label and href are editable from the CMS.
 *
 * Usage:
 *   <EditableButton
 *     labelKey="home.hero.primaryCTA"
 *     hrefKey="home.hero.primaryCTALink"
 *     fallbackLabel="Start Learning"
 *     fallbackHref="/login"
 *     className="btn-primary"
 *   />
 */
export default function EditableButton({
  labelKey,
  hrefKey,
  fallbackLabel = 'Click Here',
  fallbackHref  = '/',
  className,
  style,
  children,
  onClick,
}) {
  const { editMode, isAdmin, getValue, saveField, loadPage } = useCMS()

  const [panelOpen, setPanelOpen] = useState(false)
  const [draftLabel, setDraftLabel] = useState(fallbackLabel)
  const [draftHref, setDraftHref]   = useState(fallbackHref)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [hovered, setHovered] = useState(false)

  // Load pages for both keys on mount
  useEffect(() => {
    [labelKey, hrefKey].forEach(key => {
      if (!key) return
      try { const { page } = parseContentKey(key); loadPage(page) } catch {}
    })
  }, [labelKey, hrefKey, loadPage])

  const label = labelKey ? getValue(labelKey, fallbackLabel) : fallbackLabel
  const href  = hrefKey  ? getValue(hrefKey,  fallbackHref)  : fallbackHref

  useEffect(() => { setDraftLabel(label); setDraftHref(href) }, [label, href])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      if (labelKey && draftLabel !== label) await saveField(labelKey, draftLabel)
      if (hrefKey  && draftHref  !== href)  await saveField(hrefKey,  draftHref)
      setSaved(true)
      setPanelOpen(false)
      setTimeout(() => setSaved(false), 2200)
    } catch {
      /* leave panel open on error */
    } finally {
      setSaving(false)
    }
  }, [labelKey, hrefKey, draftLabel, draftHref, label, href, saveField])

  // View mode
  if (!editMode || !isAdmin) {
    return (
      <a href={href} className={className} style={style} onClick={onClick}>
        {children || label}
      </a>
    )
  }

  const borderColor = saved ? GREEN : PURPLE

  // Inline edit panel
  if (panelOpen) {
    return (
      <div style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 8,
        background: 'rgba(8,4,22,0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: '0 8px 36px rgba(139,92,246,0.22)',
        zIndex: 100,
        minWidth: 220,
      }}>
        <label style={labelSt}>Button Label</label>
        <input
          type="text"
          value={draftLabel}
          onChange={e => setDraftLabel(e.target.value)}
          placeholder="Button label"
          maxLength={60}
          style={inputSt}
          autoFocus
        />

        <label style={labelSt}>Link / Path</label>
        <input
          type="text"
          value={draftHref}
          onChange={e => setDraftHref(e.target.value)}
          placeholder="/page or https://…"
          maxLength={300}
          style={inputSt}
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={saveBtnSt}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={() => { setPanelOpen(false); setDraftLabel(label); setDraftHref(href) }}
            style={cancelBtnSt}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // Edit mode — idle (shows purple outline on hover)
  return (
    <a
      href={href}
      className={className}
      style={{
        ...style,
        outline: hovered ? `1.5px solid ${borderColor}` : '1.5px solid transparent',
        boxShadow: hovered ? '0 0 0 3px rgba(139,92,246,0.12)' : 'none',
        borderRadius: 6,
        transition: 'outline 0.15s, box-shadow 0.15s',
        cursor: 'text',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={e => { e.preventDefault(); setPanelOpen(true) }}
      title="Click to edit button"
    >
      {children || label}
      {saved && (
        <span style={{
          marginLeft: 6,
          background: GREEN, color: '#000',
          fontSize: 9, fontWeight: 700, padding: '1px 6px',
          borderRadius: 3, verticalAlign: 'middle',
          fontFamily: 'system-ui, sans-serif',
        }}>
          ✓
        </span>
      )}
    </a>
  )
}

const labelSt = {
  color: '#A78BFA',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  fontFamily: 'system-ui, sans-serif',
}
const inputSt = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(139,92,246,0.35)',
  borderRadius: 7,
  color: '#EDE9FE',
  fontSize: 12,
  padding: '5px 10px',
  outline: 'none',
  width: '100%',
  fontFamily: 'system-ui, sans-serif',
  boxSizing: 'border-box',
}
const saveBtnSt = {
  background: 'linear-gradient(135deg, #7B3FE4, #9B59E8)',
  color: '#fff',
  border: 'none',
  borderRadius: 7,
  padding: '5px 14px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  flex: 1,
  fontFamily: 'system-ui, sans-serif',
}
const cancelBtnSt = {
  background: 'rgba(255,255,255,0.06)',
  color: '#9CA3AF',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 7,
  padding: '5px 14px',
  fontSize: 12,
  cursor: 'pointer',
  fontFamily: 'system-ui, sans-serif',
}
