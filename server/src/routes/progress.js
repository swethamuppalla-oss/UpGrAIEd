import { Router } from 'express'
import {
  getMyProgress,
  getDashboard,
  completeModule,
  loginCheck,
} from '../controllers/progressController.js'

const router = Router()
// requireAuth is applied at server level for this prefix

router.get('/me',           getMyProgress)
router.get('/dashboard',    getDashboard)
router.post('/complete-module', completeModule)
router.post('/login-check', loginCheck)

export default router
