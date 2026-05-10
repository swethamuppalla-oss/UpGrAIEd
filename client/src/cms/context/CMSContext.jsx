import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useEditMode } from '../../context/EditModeContext'
import * as cmsService from '../services/cmsService'
import { parseContentKey, SECTION_TOP_FIELDS, getByPath } from '../utils/cmsHelpers'

const CMSContext = createContext(null)

export function CMSProvider({ children }) {
  const { editMode, isAdmin } = useEditMode()

  // sections[page][section] = CmsSection document from DB
  const [sections, setSections] = useState({})
  // Set of contentKeys currently being saved
  const [savingKeys, setSavingKeys] = useState(new Set())
  const [error, setError] = useState(null)
  // Track which pages have been fetched so we don't double-load
  const loadedPages = useRef(new Set())

  /**
   * Fetch and cache all enabled sections for a page.
   * Safe to call multiple times — subsequent calls are no-ops.
   */
  const loadPage = useCallback(async (page) => {
    if (!page || loadedPages.current.has(page)) return
    loadedPages.current.add(page)
    try {
      const list = await cmsService.fetchPageSections(page)
      setSections(prev => {
        const map = {}
        list.forEach(s => { map[s.section] = s })
        return { ...prev, [page]: map }
      })
    } catch (err) {
      loadedPages.current.delete(page)
      setError(err.message)
    }
  }, [])

  /**
   * Read a value from the CMS cache.
   * contentKey format: "page.section.field" or "page.section.meta.nested.path"
   */
  const getValue = useCallback((contentKey, fallback = '') => {
    try {
      const { page, section, field } = parseContentKey(contentKey)
      const sectionData = sections[page]?.[section]
      if (!sectionData) return fallback
      if (SECTION_TOP_FIELDS.has(field)) return sectionData[field] ?? fallback
      // Treat remaining path as metadata sub-path
      return getByPath(sectionData.metadata, field) ?? fallback
    } catch {
      return fallback
    }
  }, [sections])

  /**
   * Save a single top-level field to the DB and update the local cache.
   * Throws on failure so callers can handle the error state.
   */
  const saveField = useCallback(async (contentKey, value) => {
    const { page, section, field } = parseContentKey(contentKey)

    if (!SECTION_TOP_FIELDS.has(field)) {
      throw new Error(`Field "${field}" is inside metadata — direct single-field save is not supported yet`)
    }

    setSavingKeys(prev => new Set(prev).add(contentKey))
    setError(null)

    try {
      const updated = await cmsService.saveField(page, section, field, value)
      setSections(prev => ({
        ...prev,
        [page]: {
          ...prev[page],
          [section]: updated ?? { ...prev[page]?.[section], [field]: value },
        },
      }))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSavingKeys(prev => {
        const next = new Set(prev)
        next.delete(contentKey)
        return next
      })
    }
  }, [])

  /** Manually patch the local cache (e.g., after a full section save or toggle). */
  const updateSectionCache = useCallback((page, section, data) => {
    setSections(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [section]: { ...prev[page]?.[section], ...data },
      },
    }))
  }, [])

  /** Invalidate a page's cache so it reloads on next loadPage() call. */
  const invalidatePage = useCallback((page) => {
    loadedPages.current.delete(page)
    setSections(prev => {
      const next = { ...prev }
      delete next[page]
      return next
    })
  }, [])

  return (
    <CMSContext.Provider value={{
      editMode,
      isAdmin,
      sections,
      loadPage,
      getValue,
      saveField,
      updateSectionCache,
      invalidatePage,
      savingKeys,
      isSaving: savingKeys.size > 0,
      error,
    }}>
      {children}
    </CMSContext.Provider>
  )
}

export function useCMSContext() {
  const ctx = useContext(CMSContext)
  if (!ctx) throw new Error('useCMSContext must be used inside <CMSProvider>')
  return ctx
}
