import { Router } from 'express'
import { requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireRole('creator', 'admin'))

router.get('/stats', async (req, res, next) => {
  try {
    res.json({ students: 289, videos: 24, watchTime: '1.2K h', completion: '68%' })
  } catch (err) { next(err) }
})

router.get('/videos', async (req, res, next) => {
  try {
    res.json([
      { _id: 'v1', title: 'Intro to Python',        moduleTitle: 'Module 1', level: 1, isMustDo: true,  completionPercent: 92 },
      { _id: 'v2', title: 'Variables & Types',       moduleTitle: 'Module 2', level: 1, isMustDo: true,  completionPercent: 85 },
      { _id: 'v3', title: 'Control Flow',            moduleTitle: 'Module 3', level: 2, isMustDo: true,  completionPercent: 71 },
      { _id: 'v4', title: 'Functions Deep Dive',     moduleTitle: 'Module 4', level: 2, isMustDo: false, completionPercent: 58 },
    ])
  } catch (err) { next(err) }
})

router.post('/upload', async (req, res, next) => {
  try {
    // Stub — real upload would use multer + Bunny.net
    const { title, moduleTitle, level, isMustDo, taskDescription } = req.body
    res.json({
      _id: 'v' + Date.now(),
      title: title || 'Untitled Video',
      moduleTitle: moduleTitle || 'Module',
      level: level || 1,
      isMustDo: isMustDo === 'true' || isMustDo === true,
      completionPercent: 0,
      taskDescription,
    })
  } catch (err) { next(err) }
})

export default router
