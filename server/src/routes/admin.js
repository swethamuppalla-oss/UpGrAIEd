import { Router } from 'express'
import { requireRole } from '../middleware/auth.js'
import { Reservation } from '../models/Reservation.js'
import { User } from '../models/User.js'

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

export default router
