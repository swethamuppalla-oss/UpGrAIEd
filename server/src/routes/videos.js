import { Router } from 'express'
import { StudentProgress, NEXT_MODULE_MAP } from '../models/StudentProgress.js'
import { Video } from '../models/Video.js'

const router = Router()

function getUserId(req) {
  return req.user?._id?.toString() || req.user?.id?.toString() || 'demo'
}

async function getOrCreateProgress(userId) {
  let progress = await StudentProgress.findOne({ userId })
  if (!progress) {
    progress = await StudentProgress.create({ userId })
  }
  return progress
}

// GET /api/videos/:id/stream-url
router.get('/:id/stream-url', async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)
    if (video) {
      return res.json({ streamUrl: video.url })
    }
    
    // Fallback for old hardcoded modules
    const videoId = '943c03d8-674c-4c08-bc61-f31a7aad75a0'
    const libraryId = process.env.BUNNY_LIBRARY_ID || '651349'
    const streamUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true`

    res.json({ streamUrl })
  } catch (err) {
    next(err)
  }
})

// GET /api/videos/:id/my-progress
router.get('/:id/my-progress', async (req, res, next) => {
  try {
    const { id } = req.params
    const progress = await getOrCreateProgress(getUserId(req))
    const percent = progress.completedModules.includes(id) ? 100 : 0

    res.json({ percent })
  } catch (err) {
    next(err)
  }
})

// POST /api/videos/:id/progress
router.post('/:id/progress', async (req, res, next) => {
  try {
    const { id } = req.params
    const rawPercent = Number(req.body?.percent)

    if (Number.isNaN(rawPercent) || rawPercent < 0 || rawPercent > 100) {
      return res.status(400).json({ message: 'percent must be a number between 0 and 100' })
    }

    const progress = await getOrCreateProgress(getUserId(req))
    const alreadyCompleted = progress.completedModules.includes(id)

    if (rawPercent >= 100 && !alreadyCompleted) {
      progress.completedModules.push(id)
      progress.totalXP += 50
      progress.currentLevel = progress.computeLevel()
      progress.lastCompletedAt = new Date()

      const nextId = NEXT_MODULE_MAP[id]
      if (nextId && !progress.unlockedModules.includes(nextId)) {
        progress.unlockedModules.push(nextId)
      }

      await progress.save()
    }

    res.json({
      success: true,
      percent: rawPercent,
      completed: rawPercent >= 100 || alreadyCompleted,
      unlockedModules: progress.unlockedModules,
    })
  } catch (err) {
    next(err)
  }
})

export default router
