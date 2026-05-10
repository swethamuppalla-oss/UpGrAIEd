import { Router } from 'express'
import { requireAuth, requireRole } from '../../middleware/auth.js'
import { sanitizeCms, validateSectionMw, validateReorderMw } from './cms.middleware.js'
import uploadRouter from '../../routes/upload.js'
import {
  getPublicSections,
  getAllSections,
  upsertSection,
  updateSectionGeneric,
  toggleSection,
  reorderSections,
  getPageConfig,
} from './cms.controller.js'

const router = Router()

// ── Specific named routes (must come before catch-all /:page) ─────────────────

// PUT /api/cms/update — single-field or partial section update
router.put(
  '/update',
  requireAuth, requireRole('admin'),
  sanitizeCms, validateSectionMw,
  updateSectionGeneric
)

// POST /api/cms/media/upload — alias for the upload router (auth is handled inside uploadRouter)
router.use('/media', uploadRouter)

// ── Existing routes ───────────────────────────────────────────────────────────

// GET /api/cms/:page/all — admin: all sections including disabled
router.get('/:page/all', requireAuth, requireRole('admin'), getAllSections)

// GET /api/cms/:page/config — admin: page section summary
router.get('/:page/config', requireAuth, requireRole('admin'), getPageConfig)

// PUT /api/cms/:page/:section — admin: upsert section
router.put(
  '/:page/:section',
  requireAuth, requireRole('admin'),
  sanitizeCms, validateSectionMw,
  upsertSection
)

// PATCH /api/cms/:page/:section/toggle — admin: toggle visibility
router.patch('/:page/:section/toggle', requireAuth, requireRole('admin'), toggleSection)

// POST /api/cms/:page/reorder — admin: set section order
router.post('/:page/reorder', requireAuth, requireRole('admin'), validateReorderMw, reorderSections)

// GET /api/cms/:page — public: enabled sections (catch-all, keep last)
router.get('/:page', getPublicSections)

export default router
