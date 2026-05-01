import { Router } from 'express'

const router = Router()
// requireAuth already applied at server level

// GET /api/videos/:id/stream-url
    // Use the specific video ID provided by the user for all modules
    const videoId = '943c03d8-674c-4c08-bc61-f31a7aad75a0'
    const libraryId = process.env.BUNNY_LIBRARY_ID || '651349'
    
    // Using standard Bunny Stream embed URL for reliability
    const streamUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true`
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
