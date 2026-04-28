import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  uploadChapter,
  getChapterStatus,
  getChapters
} from '../controllers/chapterController.js'
import {
  getWeekPlan,
  getStudentCurrentPlan,
  approveWeekPlan,
  completeDayInPlan,
  submitExam
} from '../controllers/weekPlanController.js'

const router = Router()

const uploadDir = 'uploads'
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'chapter-' + unique + path.extname(file.originalname))
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only images allowed'))
  }
})

// Chapter routes (parent)
router.post('/upload',
  requireAuth, requireRole('parent'),
  upload.array('photos', 6),
  uploadChapter)
router.get('/',
  requireAuth, requireRole('parent'),
  getChapters)
router.get('/:id/status',
  requireAuth,
  getChapterStatus)

// Week plan routes
router.get('/weekplan/current',
  requireAuth, requireRole('student'),
  getStudentCurrentPlan)
router.get('/weekplan/:id',
  requireAuth,
  getWeekPlan)
router.post('/weekplan/:id/approve',
  requireAuth, requireRole('parent'),
  approveWeekPlan)
router.post('/weekplan/:planId/day/:dayNumber/complete',
  requireAuth, requireRole('student'),
  completeDayInPlan)
router.post('/weekplan/:id/exam/submit',
  requireAuth, requireRole('student'),
  submitExam)

export default router
