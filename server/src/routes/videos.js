import { Router } from 'express'

const router = Router()
// requireAuth already applied at server level

// GET /api/videos/:id/stream-url
router.get('/:id/stream-url', async (req, res, next) => {
  try {
    const { id } = req.params
    // Stub — real implementation would query Bunny.net CDN
    const cdnHost = process.env.BUNNY_CDN_HOSTNAME || 'vz-demo.b-cdn.net'
    const streamUrl = `https://${cdnHost}/${id}/play_720p.mp4`
    res.json({ streamUrl })
  } catch (err) { next(err) }
})

// GET /api/videos/:id/my-progress
router.get('/:id/my-progress', async (req, res, next) => {
  try {
    res.json({ percent: 0 })
  } catch (err) { next(err) }
})

import { StudentProgress } from '../models/StudentProgress.js'

router.post('/:id/progress', async (req, res, next) => {
  try {
    const { id } = req.params
    const { percent } = req.body
    const userId = req.user._id

    if (percent >= 100) {
      const progress = await StudentProgress.findOne({ userId })
      if (progress && !progress.completedModules.includes(id)) {
        progress.completedModules.push(id)
        // Add some XP for completion
        progress.totalXP += 50 
        // Unlock next if mapped
        const NEXT_MAP = { 'mod1': 'mod2', 'mod2': 'mod3', 'mod3': 'mod4', 'mod4': 'mod5' }
        const nextId = NEXT_MAP[id]
        if (nextId && !progress.unlockedModules.includes(nextId)) {
          progress.unlockedModules.push(nextId)
        }
        await progress.save()
      }
    }

    res.json({ success: true, percent })
  } catch (err) { next(err) }
})

export default router
