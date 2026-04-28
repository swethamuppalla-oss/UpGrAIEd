import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { getConfig, upsertConfig as apiUpsert } from '../services/api'

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
  updateConfig: () => {},
  refetch: () => {},
})

export { ConfigContext }
export default ConfigContext

// ── Provider ──────────────────────────────────────────────────────────────────
export function ConfigProvider({ children }) {
  const [config, setConfig]   = useState(() => readCache() || {})
  const [loading, setLoading] = useState(false)
  const fetchedRef = useRef(false)

  const fetchConfig = useCallback(async (force = false) => {
    if (!force && fetchedRef.current) return
    setLoading(true)
    try {
      const data = await getConfig()
      setConfig(data)
      writeCache(data)
      fetchedRef.current = true
    } catch (err) {
      // Keep cached data — don't wipe it on network failure
      console.warn('[Config] Fetch failed, using cache:', err?.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount — skip if fresh cache already loaded
  useEffect(() => {
    const cached = readCache()
    if (cached) {
      // Cache is fresh; still kick off a background refresh so changes propagate
      fetchConfig(true)
    } else {
      fetchConfig(false)
    }
  }, [fetchConfig])

  /**
   * Optimistically update a top-level config key in memory + cache,
   * then persist to the server.  Used by AdminControlPanel after save.
   */
  const updateConfig = useCallback(async (key, value) => {
    setConfig(prev => {
      const next = { ...prev, [key]: value }
      writeCache(next)
      return next
    })
    await apiUpsert(key, value)
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
    <ConfigContext.Provider value={{ config, loading, updateConfig, refetch }}>
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
