import { useState, useEffect, useCallback } from 'react'
import { useCMS } from '../hooks/useCMS'
import { parseContentKey } from '../utils/cmsHelpers'

const PURPLE = 'rgba(139,92,246,0.7)'
const GREEN  = '#6EDC5F'
const AMBER  = '#F59E0B'

/**
 * Dynamic text element that loads from the CMS DB and enables inline editing.
 *
 * Usage:
 *   <EditableText contentKey="home.hero.title" as="h1" className="hero-title" />
 *   <EditableText contentKey="home.hero.subtitle" multiline as="p" />
 */
export default function EditableText({
  contentKey,
  fallback = '',
  as: Tag = 'span',
  multiline = false,
  maxLength,
  className,
  style,
}) {
  const { editMode, isAdmin, getValue, saveField, loadPage } = useCMS()

  // Trigger page load on mount
  useEffect(() => {
    if (!contentKey) return
    try {
      const { page } = parseContentKey(contentKey)
      loadPage(page)
    } catch {}
  }, [contentKey, loadPage])

  const value = contentKey ? getValue(contentKey, fallback) : fallback

  const [draft, setDraft]   = useState(value)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => { if (!editing) setDraft(value) }, [value, editing])

  const handleBlur = useCallback(async () => {
    const trimmed = draft?.trim?.() ?? draft
    if (!contentKey || trimmed === value || saving) {
      setDraft(value)
      setEditing(false)
      return
    }
    setSaving(true)
    try {
      await saveField(contentKey, trimmed)
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 2200)
    } catch {
      setDraft(value)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }, [draft, value, contentKey, saveField, saving])

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') e.target.blur()
    if (e.key === 'Escape') { setDraft(value); e.target.blur() }
  }

  // View mode — always render as the tag with no edit chrome
  if (!editMode || !isAdmin) {
    return <Tag style={style} className={className}>{value}</Tag>
  }

  const outlineColor = saving ? AMBER : saved ? GREEN : PURPLE
  const glowColor    = saving
    ? 'rgba(245,158,11,0.18)'
    : saved ? 'rgba(110,220,95,0.18)' : 'rgba(139,92,246,0.12)'

  const limit = maxLength ?? (multiline ? 500 : 200)

  // Edit mode — idle (clickable)
  if (!editing) {
    return (
      <Tag
        title="Click to edit"
        style={{
          ...style,
          cursor: 'text',
          position: 'relative',
          borderRadius: 4,
          outline: hovered ? `1.5px solid ${outlineColor}` : '1.5px solid transparent',
          boxShadow: hovered ? `0 0 0 3px ${glowColor}` : 'none',
          padding: hovered ? '2px 6px' : undefined,
          transition: 'outline 0.15s, box-shadow 0.15s, padding 0.15s',
        }}
        className={className}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setEditing(true)}
      >
        {saved && (
          <span style={{
            position: 'absolute', top: -20, right: 0,
            background: GREEN, color: '#000',
            fontSize: 9, fontWeight: 700, padding: '2px 7px',
            borderRadius: 3, letterSpacing: '0.6px',
            pointerEvents: 'none', zIndex: 20,
            fontFamily: 'system-ui, sans-serif',
          }}>
            SAVED ✓
          </span>
        )}
        {value || <span style={{ opacity: 0.35, fontStyle: 'italic' }}>{fallback || 'Click to edit'}</span>}
      </Tag>
    )
  }

  // Edit mode — active input
  const inputStyle = {
    background: 'rgba(12,6,30,0.88)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1.5px solid ${outlineColor}`,
    boxShadow: `0 0 0 3px ${glowColor}, 0 4px 24px rgba(0,0,0,0.35)`,
    borderRadius: 6,
    color: '#F3E8FF',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    fontFamily: 'inherit',
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
    padding: '6px 12px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  if (multiline) {
    return (
      <textarea
        value={draft ?? ''}
        onChange={e => setDraft(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        maxLength={limit}
        rows={3}
        style={{ ...inputStyle, resize: 'vertical', display: 'block' }}
        className={className}
        autoFocus
        disabled={saving}
      />
    )
  }

  return (
    <input
      type="text"
      value={draft ?? ''}
      onChange={e => setDraft(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      maxLength={limit}
      style={inputStyle}
      className={className}
      autoFocus
      disabled={saving}
    />
  )
}
