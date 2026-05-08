import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { getUIConfig, updateUIConfig } from '../services'
import { DEFAULT_THEME } from '../config/defaults'

// ── Cache helpers ─────────────────────────────────────────────────────────────
const CACHE_KEY = 'upgraied_config_v2'
const TTL_MS    = 5 * 60 * 1000   // 5 minutes

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { ts, data } = JSON.parse(raw)
    if (Date.now() - ts > TTL_MS) return null
    return data
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  } catch {}
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}

// ── Context ───────────────────────────────────────────────────────────────────
const ConfigContext = createContext({
  config: {},
  loading: false,
  isConfigReady: false,
  updateConfig: () => {},
  refetch: () => {},
})

export { ConfigContext }
export default ConfigContext

// ── Provider ──────────────────────────────────────────────────────────────────
export function ConfigProvider({ children }) {
  const [config, setConfig]           = useState(() => readCache() || {})
  const [loading, setLoading]         = useState(false)
  // Ready immediately if cache was warm on mount; set true after any successful fetch
  const [isConfigReady, setIsConfigReady] = useState(() => !!readCache())
  const fetchedRef = useRef(false)

  const fetchConfig = useCallback(async (force = false) => {
    if (!force && fetchedRef.current) return
    setLoading(true)
    try {
      const data = await getUIConfig()
      setConfig(data)
      writeCache(data)
      fetchedRef.current = true
      setIsConfigReady(true)
    } catch (err) {
      // Keep cached data — don't wipe it on network failure
      console.warn('[Config] Fetch failed, using cache:', err?.message)
      // Still mark ready so the UI renders with whatever we have (cache or defaults)
      setIsConfigReady(true)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount — skip if fresh cache already loaded
  useEffect(() => {
    const cached = readCache()
    if (cached) {
      fetchConfig(true)
    } else {
      fetchConfig(false)
    }
  }, [fetchConfig])

  // Apply admin-configured brand colors as CSS variables whenever theme config changes.
  // Merges against DEFAULT_THEME so partial admin configs never leave a variable unset.
  useEffect(() => {
    const theme = { ...DEFAULT_THEME, ...(config.theme || {}) }
    const root  = document.documentElement
    const vars = {
      '--brand-primary':   theme.primaryColor,
      '--brand-accent':    theme.accentColor,
      '--brand-highlight': theme.highlightColor,
    }
    Object.entries(vars).forEach(([key, value]) => {
      if (value) root.style.setProperty(key, value)
    })
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Config] theme applied:', theme)
      console.debug('[Config] features:', config.features)
    }
  }, [config.theme, config.features])

  /**
   * Optimistically update a top-level config key in memory + cache,
   * then persist to the server. Throws on server error so callers can show feedback.
   */
  const updateConfig = useCallback(async (key, value) => {
    // Optimistic local update
    setConfig(prev => {
      const next = { ...prev, [key]: value }
      writeCache(next)
      return next
    })
    // Persist — let errors propagate so admin UI can show them
    await updateUIConfig({ [key]: value })
  }, [])

  /**
   * Force a full re-fetch, bypassing cache.
   */
  const refetch = useCallback(() => {
    clearCache()
    fetchedRef.current = false
    return fetchConfig(true)
  }, [fetchConfig])

  return (
    <ConfigContext.Provider value={{ config, loading, isConfigReady, updateConfig, refetch }}>
      {children}
    </ConfigContext.Provider>
  )
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * useConfig() — backward-compatible: returns the plain config object.
 * Existing callers (HeroSection, PricingCards, etc.) need zero changes.
 */
export function useConfig() {
  const { config } = useContext(ConfigContext)
  return config ?? {}
}

/**
 * useConfigReady() — returns true once config has been resolved from either
 * cache or network.  Use to conditionally render skeletons in components that
 * must show accurate data rather than defaults.  Do NOT block the entire app
 * render on this — prefer per-component skeletons.
 */
export function useConfigReady() {
  return useContext(ConfigContext).isConfigReady
}
