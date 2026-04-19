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

// POST /api/videos/:id/progress
router.post('/:id/progress', async (req, res, next) => {
  try {
    const { percent } = req.body
    // Real implementation would upsert VideoProgress in DB
    res.json({ success: true, percent })
  } catch (err) { next(err) }
})

export default router
