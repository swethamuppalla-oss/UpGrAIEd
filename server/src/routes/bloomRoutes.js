import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { generateWeekPlanFromChapter } from '../controllers/bloomController.js'

const router = Router()

// Trigger generation
router.post('/generate/:chapterId', requireAuth, requireRole('parent'), generateWeekPlanFromChapter)

export default router
