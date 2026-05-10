import { useEditMode } from '../../context/EditModeContext'

/**
 * Thin wrapper — keeps cms/ code decoupled from the EditModeContext path.
 * Returns the same shape as useEditMode().
 */
export function useAdminEditMode() {
  return useEditMode()
}
