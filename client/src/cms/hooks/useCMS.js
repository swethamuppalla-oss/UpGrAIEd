import { useCMSContext } from '../context/CMSContext'

/**
 * Primary hook for CMS-aware components.
 * Exposes the full CMSContext surface.
 */
export function useCMS() {
  return useCMSContext()
}
