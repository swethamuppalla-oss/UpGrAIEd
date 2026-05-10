import { useState, useCallback, useEffect } from 'react'

/**
 * Manages per-element editable state: draft value, editing mode, and async save.
 * On save success, shows a brief "saved" flash then resets.
 */
export function useEditable(currentValue, onSave) {
  const [draft, setDraft] = useState(currentValue)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Keep draft in sync when currentValue changes externally (e.g., after DB reload)
  useEffect(() => {
    if (!editing) setDraft(currentValue)
  }, [currentValue, editing])

  const startEdit = useCallback(() => {
    setDraft(currentValue)
    setEditing(true)
    setSaved(false)
  }, [currentValue])

  const cancelEdit = useCallback(() => {
    setDraft(currentValue)
    setEditing(false)
  }, [currentValue])

  const commit = useCallback(async () => {
    const trimmed = typeof draft === 'string' ? draft.trim() : draft
    if (trimmed === currentValue || saving) return
    setSaving(true)
    try {
      await onSave(trimmed)
      setSaved(true)
      setEditing(false)
      const t = setTimeout(() => setSaved(false), 2200)
      return () => clearTimeout(t)
    } catch {
      // keep editing open on error so user can retry
    } finally {
      setSaving(false)
    }
  }, [draft, currentValue, onSave, saving])

  return { draft, setDraft, editing, saving, saved, startEdit, cancelEdit, commit }
}
