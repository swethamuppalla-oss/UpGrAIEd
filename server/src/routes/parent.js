import { Router } from 'express'
import { requireRole } from '../middleware/auth.js'
import { Reservation } from '../models/Reservation.js'
import { calculatePricing } from '../config/razorpay.js'

const router = Router()
router.use(requireRole('parent'))

// GET /api/parent/child
router.get('/child', async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({ phone: req.user.phone })
    if (reservation) {
      return res.json({
        name: reservation.childName,
        grade: reservation.grade,
        programme: parseInt(reservation.grade?.split(' ')[1]) <= 8 ? 'Junior' : 'Senior',
        currentLevel: 1,
        progress: 0,
        streak: 0,
        modulesCompleted: 0,
        totalHours: 0,
      })
    }
    // Dev fallback
    res.json({
      name: 'Demo Student',
      grade: 'Grade 8',
      programme: 'Junior',
      currentLevel: 3,
      progress: 45,
      streak: 7,
      modulesCompleted: 12,
      totalHours: 18,
    })
  } catch (err) { next(err) }
})

// GET /api/parent/activity
router.get('/activity', async (req, res, next) => {
  try {
    res.json([
      { module: 'Introduction to Python', level: 'Level 1', status: 'completed', date: new Date().toISOString() },
      { module: 'Variables & Data Types',  level: 'Level 1', status: 'completed', date: new Date(Date.now() - 86400000).toISOString() },
      { module: 'Control Flow & Loops',    level: 'Level 2', status: 'in-progress', date: new Date(Date.now() - 2*86400000).toISOString() },
    ])
  } catch (err) { next(err) }
})

// GET /api/parent/billing
router.get('/billing', async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({ phone: req.user.phone })
    if (reservation?.status === 'paid') {
      const pricing = calculatePricing(reservation.grade)
      return res.json({
        amount: pricing.total,
        date: reservation.updatedAt,
        status: 'paid',
        invoiceId: 'INV-' + reservation._id.toString().slice(-6).toUpperCase(),
        grade: reservation.grade,
        programme: parseInt(reservation.grade?.split(' ')[1]) <= 8 ? 'Junior' : 'Senior',
      })
    }
    res.json(null)
  } catch (err) { next(err) }
})

// GET /api/parent/payment-status
router.get('/payment-status', async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({ phone: req.user.phone })
    if (!reservation) {
      if (process.env.NODE_ENV !== 'production') {
        const pricing = calculatePricing('Grade 8')
        return res.json({
          status: 'approved',
          parentName: req.user.name || 'Demo Parent',
          childName: 'Demo Student',
          grade: 'Grade 8',
          email: 'demo@upgraied.dev',
          phone: req.user.phone,
          programme: 'Junior',
          pricing,
        })
      }
      return res.json({ status: 'none' })
    }
    if (reservation.status === 'paid')    return res.json({ status: 'paid' })
    if (reservation.status === 'pending') return res.json({ status: 'reserved' })
    if (reservation.status === 'approved') {
      const pricing = calculatePricing(reservation.grade)
      return res.json({
        status: 'approved',
        parentName: reservation.parentName,
        childName: reservation.childName,
        grade: reservation.grade,
        email: reservation.email,
        phone: reservation.phone,
        programme: parseInt(reservation.grade?.split(' ')[1]) <= 8 ? 'Junior' : 'Senior',
        pricing,
      })
    }
    res.json({ status: 'none' })
  } catch (err) { next(err) }
})

export default router
