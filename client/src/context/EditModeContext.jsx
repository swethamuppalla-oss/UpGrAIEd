import { createContext, useContext, useState, useCallback } from 'react'
import ConfigContext from './ConfigContext'
import { useAuth } from './AuthContext'
import { updateUIConfig, upsertConfig, getConfigByKey } from '../services'
import { validateUIConfig, isFieldEditable, PAGES_DEFAULT } from '../utils/uiValidation'

const EditModeContext = createContext(null)

const MAX_HISTORY = 5

// Deep-set a dot-path value into an object (immutably)
function setNested(obj, path, value) {
  const keys = path.split('.')
  const out = { ...obj }
  let cur = out
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...(cur[keys[i]] || {}) }
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
  return out
}

export function EditModeProvider({ children }) {
  const { config, updateConfig } = useContext(ConfigContext)
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [editMode, setEditMode] = useState(false)
  const [draftConfig, setDraftConfig] = useState(null)

  const enterEditMode = useCallback(() => {
    if (!isAdmin) return
    const existing = config?.ui?.sections
    const fallbackHero = {
      title: config?.ui?.hero?.title || '',
      subtitle: config?.ui?.hero?.subtitle || '',
      ctaText: 'Start Learning Free',
      image: config?.mascot?.bloom?.main_image || '',
    }
    const existingPages = config?.pages || {}
    setDraftConfig({
      sections: {
        hero:   existing?.hero   || fallbackHero,
        navbar: existing?.navbar || { logo: '', brandName: 'UpgrAIed' },
      },
      pages: {
        home:        { ...PAGES_DEFAULT.home,        ...existingPages.home },
        whyUpgraied: { ...PAGES_DEFAULT.whyUpgraied, ...existingPages.whyUpgraied },
        pricing:     { ...PAGES_DEFAULT.pricing,     ...existingPages.pricing },
        login:       { ...PAGES_DEFAULT.login,       ...existingPages.login },
        // v2 editable-sections pages
        whyV2:     { ...PAGES_DEFAULT.whyV2,     ...existingPages.whyV2 },
        pricingV2: { ...PAGES_DEFAULT.pricingV2, ...existingPages.pricingV2 },
      },
    })
    setEditMode(true)
  }, [config, isAdmin])

  // ── Existing hero/navbar draft (whitelist-guarded) ────────────────────────────
  const updateDraft = useCallback((section, changes) => {
    const safeChanges = Object.fromEntries(
      Object.entries(changes).filter(([field]) => isFieldEditable(section, field))
    )
    if (Object.keys(safeChanges).length === 0) return
    setDraftConfig(prev => ({
      ...prev,
      sections: {
        ...prev?.sections,
        [section]: { ...prev?.sections?.[section], ...safeChanges },
      },
    }))
  }, [])

  // ── Page-level draft helpers (admin-gated by editMode + isAdmin) ──────────────

  /** Update a single field at a dot-path within a page. */
  const updatePageField = useCallback((page, dotPath, value) => {
    setDraftConfig(prev => ({
      ...prev,
      pages: {
        ...prev?.pages,
        [page]: setNested(prev?.pages?.[page] || {}, dotPath, value),
      },
    }))
  }, [])

  /** Replace one item in a page array by index. */
  const updatePageArrayItem = useCallback((page, arrayKey, index, item) => {
    setDraftConfig(prev => {
      const arr = [...(prev?.pages?.[page]?.[arrayKey] || [])]
      arr[index] = item
      return {
        ...prev,
        pages: {
          ...prev?.pages,
          [page]: { ...prev?.pages?.[page], [arrayKey]: arr },
        },
      }
    })
  }, [])

  /** Append a new item to a page array. */
  const addPageArrayItem = useCallback((page, arrayKey, defaultItem) => {
    setDraftConfig(prev => {
      const arr = [...(prev?.pages?.[page]?.[arrayKey] || []), defaultItem]
      return {
        ...prev,
        pages: {
          ...prev?.pages,
          [page]: { ...prev?.pages?.[page], [arrayKey]: arr },
        },
      }
    })
  }, [])

  /** Remove an item from a page array by index. */
  const removePageArrayItem = useCallback((page, arrayKey, index) => {
    setDraftConfig(prev => {
      const arr = (prev?.pages?.[page]?.[arrayKey] || []).filter((_, i) => i !== index)
      return {
        ...prev,
        pages: {
          ...prev?.pages,
          [page]: { ...prev?.pages?.[page], [arrayKey]: arr },
        },
      }
    })
  }, [])

  /** Return current page data — draft in edit mode, live config otherwise. */
  const getPageData = useCallback((page) => {
    if (editMode && draftConfig) return draftConfig.pages?.[page] || {}
    return config?.pages?.[page] || {}
  }, [editMode, draftConfig, config])

  // ── Publish ───────────────────────────────────────────────────────────────────
  const publishDraft = useCallback(async () => {
    if (!draftConfig) throw new Error('No draft to publish')

    const errors = validateUIConfig(draftConfig)
    if (errors.length) throw new Error(errors.join('\n'))

    // Maintain rolling history (max MAX_HISTORY entries)
    try {
      const current = await getConfigByKey('ui_history').catch(() => [])
      const arr = Array.isArray(current) ? current : []
      const entry = { savedAt: new Date().toISOString(), snapshot: config?.ui || {} }
      await upsertConfig('ui_history', [entry, ...arr].slice(0, MAX_HISTORY))
    } catch {}

    const merged = {
      ...config?.ui,
      sections: draftConfig.sections,
      status: 'published',
    }
    await updateUIConfig(merged)
    await updateConfig('ui', merged)

    if (draftConfig.pages) {
      await updateConfig('pages', draftConfig.pages)
    }

    setEditMode(false)
    setDraftConfig(null)
    return merged
  }, [draftConfig, config, updateConfig])

  const discardDraft = useCallback(() => {
    setDraftConfig(null)
    setEditMode(false)
  }, [])

  const restoreVersion = useCallback(async (snapshot) => {
    if (!snapshot) throw new Error('Invalid snapshot')
    await updateUIConfig(snapshot)
    await updateConfig('ui', snapshot)
    setEditMode(false)
    setDraftConfig(null)
  }, [updateConfig])

  // Stable section accessor — returns draft section in edit mode, else live config
  const getSection = useCallback((name) => {
    if (editMode && draftConfig) return draftConfig.sections?.[name] || {}
    return config?.ui?.sections?.[name] || {}
  }, [editMode, draftConfig, config])

  // Hero config with legacy path fallback for backward compat
  const activeHeroConfig = editMode && draftConfig
    ? draftConfig.sections?.hero
    : (config?.ui?.sections?.hero || {
        title: config?.ui?.hero?.title,
        subtitle: config?.ui?.hero?.subtitle,
      })

  return (
    <EditModeContext.Provider value={{
      editMode,
      isAdmin,
      enterEditMode,
      exitEditMode: discardDraft,
      draftConfig,
      hasDraft: !!draftConfig,
      updateDraft,
      updatePageField,
      updatePageArrayItem,
      addPageArrayItem,
      removePageArrayItem,
      getPageData,
      publishDraft,
      discardDraft,
      restoreVersion,
      getSection,
      activeHeroConfig,
    }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  const ctx = useContext(EditModeContext)
  if (!ctx) throw new Error('useEditMode must be used within EditModeProvider')
  return ctx
}
