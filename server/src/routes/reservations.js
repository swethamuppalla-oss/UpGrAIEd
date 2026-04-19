import { Router } from 'express'
import { Reservation } from '../models/Reservation.js'

const router = Router()
// PUBLIC — no auth required

// POST /api/reserve
router.post('/', async (req, res, next) => {
  try {
    const { parentName, childName, grade, city, phone, email, source } = req.body
    if (!parentName || !childName || !grade || !phone || !email) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    const cleanPhone = phone.replace(/^\+91/, '').replace(/\s+/g, '')
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({ message: 'Invalid phone number' })
    }
    const existing = await Reservation.findOne({ phone: cleanPhone })
    if (existing) {
      return res.status(409).json({ message: 'This phone number is already registered.' })
    }
    const programme = parseInt(grade.split(' ')[1]) <= 8 ? 'Junior' : 'Senior'
    const reservation = await Reservation.create({ parentName, childName, grade, city, phone: cleanPhone, email, source, programme })
    res.status(201).json({ reservationId: reservation._id, message: 'Reservation created successfully' })
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'This phone number is already registered.' })
    next(err)
  }
})

// GET /api/reserve/check/:phone
router.get('/check/:phone', async (req, res, next) => {
  try {
    const cleanPhone = req.params.phone.replace(/^\+91/, '').replace(/\s+/g, '')
    const existing = await Reservation.findOne({ phone: cleanPhone })
    res.json({ exists: !!existing })
  } catch (err) { next(err) }
})

export default router
