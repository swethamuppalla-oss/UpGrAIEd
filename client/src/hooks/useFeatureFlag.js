import { useConfigValue } from './useConfigValue'
import { DEFAULT_FEATURES } from '../config/defaults'

/**
 * Read a feature flag from the CMS config.
 * Falls back to DEFAULT_FEATURES[flag] so the app behaves correctly
 * before config loads or if the flag hasn't been set by an admin.
 *
 * Usage:
 *   const showPricing = useFeatureFlag('pricing')
 *   const showExplainer = useFeatureFlag('studyExplainer')
 */
export function useFeatureFlag(flag) {
  const fallback = DEFAULT_FEATURES[flag] ?? false
  return useConfigValue(`features.${flag}`, fallback)
}
