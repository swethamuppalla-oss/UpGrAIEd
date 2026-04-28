import { useContext } from 'react'
import ConfigContext from '../context/ConfigContext'

/**
 * Read a single value from the CMS config by dot-path.
 *
 * Usage:
 *   const title = useConfigValue('ui.hero.title', 'Default Title')
 *   const img   = useConfigValue('mascot.bloom.main_image', null)
 *   const plans = useConfigValue('pricing.plans', [])
 */
export function useConfigValue(path, fallback = undefined) {
  const { config } = useContext(ConfigContext)
  if (!config || !path) return fallback

  const value = path.split('.').reduce((obj, key) => {
    if (obj == null) return undefined
    return obj[key]
  }, config)

  return value !== undefined && value !== null ? value : fallback
}

/**
 * Access the full config state object.
 * Returns { config, loading, updateConfig, refetch }.
 * Use this in the admin panel or wherever you need more than just a value.
 */
export function useConfigState() {
  return useContext(ConfigContext)
}
