import express from 'express'
import {
  trainROB,
  getKnowledge,
  getCreatorKnowledge,
  deleteKnowledge,
  publishModule,
  getQuiz,
  chatWithROB,
  saveXP,
  getProgress,
} from '../controllers/robController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth)

router.get('/knowledge/:moduleId', getKnowledge)
router.get('/quiz', getQuiz)
router.post('/chat', chatWithROB)
router.post('/xp', saveXP)
router.get('/progress', getProgress)

router.post('/train', requireRole('creator'), trainROB)
router.get('/creator/knowledge', requireRole('creator'), getCreatorKnowledge)
router.delete('/knowledge/:id', requireRole('creator'), deleteKnowledge)
router.post('/publish/:moduleId', requireRole('creator'), publishModule)

export default router
