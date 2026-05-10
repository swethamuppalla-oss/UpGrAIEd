import { Router } from 'express'
import { requireAuth, requireRole } from '../../middleware/auth.js'
import {
  getPublicSections,
  getAllSections,
  upsertSection,
  toggleSection,
  reorderSections,
} from './cms.controller.js'

const router = Router()

// Public
router.get('/:page', getPublicSections)

// Admin only
router.get('/:page/all', requireAuth, requireRole('admin'), getAllSections)
router.put('/:page/:section', requireAuth, requireRole('admin'), upsertSection)
router.patch('/:page/:section/toggle', requireAuth, requireRole('admin'), toggleSection)
router.post('/:page/reorder', requireAuth, requireRole('admin'), reorderSections)

export default router
