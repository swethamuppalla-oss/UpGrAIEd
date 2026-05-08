import { Router } from 'express'
import { requireRole } from '../middleware/auth.js'
import { Reservation } from '../models/Reservation.js'
import { User } from '../models/User.js'
import { Video } from '../models/Video.js'
import { Module } from '../models/Module.js'

const router = Router()

// requireAuth is already applied at server level; add role check here
router.use(requireRole('admin'))

// GET /api/admin/stats
router.get('/stats', async (req, res, next) => {
  try {
    const [totalUsers, pendingReservations] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Reservation.countDocuments({ status: 'pending' }),
    ])
    res.json({ totalUsers, pendingReservations, totalRevenue: 0, activeToday: 0 })
  } catch (err) { next(err) }
})

// GET /api/admin/reservations
router.get('/reservations', async (req, res, next) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 }).limit(100)
    res.json(reservations)
  } catch (err) { next(err) }
})

// POST /api/admin/approve/:id
router.post('/approve/:id', async (req, res, next) => {
  try {
    const r = await Reservation.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true })
    if (!r) return res.status(404).json({ message: 'Reservation not found' })
    res.json(r)
  } catch (err) { next(err) }
})

// GET /api/admin/payments
router.get('/payments', async (req, res, next) => {
  try {
    // Return paid reservations as payment records for now
    const paid = await Reservation.find({ status: 'paid' }).sort({ updatedAt: -1 })
    res.json(paid.map(r => ({
      _id: r._id,
      userEmail: r.email,
      orderId: null,
      amount: 6999,
      status: 'paid',
    })))
  } catch (err) { next(err) }
})

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(100)
    res.json(users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email || u.phone,
      role: u.role,
      isBlocked: !u.isActive,
      createdAt: u.createdAt,
    })))
  } catch (err) { next(err) }
})

// POST /api/admin/users/:id/block
router.post('/users/:id/block', async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ message: 'User blocked' })
  } catch (err) { next(err) }
})

// POST /api/admin/users/:id/unblock
router.post('/users/:id/unblock', async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: true })
    res.json({ message: 'User unblocked' })
  } catch (err) { next(err) }
})

// --- VIDEO CMS ---

// GET /api/admin/videos
router.get('/videos', async (req, res, next) => {
  try {
    const videos = await Video.find().populate('module').sort({ createdAt: -1 })
    res.json(videos)
  } catch (err) { next(err) }
})

// POST /api/admin/videos
router.post('/videos', async (req, res, next) => {
  try {
    const { title, description, url, thumbnail, module, durationSeconds, order } = req.body
    
    // Auto-extract Bunny.net thumbnail if available
    let generatedThumbnail = thumbnail
    if (!generatedThumbnail && url && url.includes('iframe.mediadelivery.net')) {
      // Example url: https://iframe.mediadelivery.net/embed/651349/943c03d8-674c-4c08-bc61-f31a7aad75a0
      const parts = url.split('/')
      const videoId = parts[parts.length - 1].split('?')[0]
      if (videoId) {
        generatedThumbnail = `https://vz-a8b2c5c9-xxx.b-cdn.net/${videoId}/thumbnail.jpg` // generic fallback for now, real implementation would require pullzone id
      }
    }

    // Default module fallback if not provided
    let modId = module;
    if (!modId) {
      let mod = await Module.findOne();
      if (!mod) mod = await Module.create({ level: '65f01234abcd567890abcdef', title: 'Default Module' }); // dummy level ref
      modId = mod._id;
    }

    const video = await Video.create({
      title, description, url, thumbnail: generatedThumbnail, module: modId, durationSeconds, order
    })
    res.json(video)
  } catch (err) { next(err) }
})

// PUT /api/admin/videos/:id
router.put('/videos/:id', async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(video)
  } catch (err) { next(err) }
})

// DELETE /api/admin/videos/:id
router.delete('/videos/:id', async (req, res, next) => {
  try {
    await Video.findByIdAndDelete(req.params.id)
    res.json({ message: 'Video deleted' })
  } catch (err) { next(err) }
})

export default router
