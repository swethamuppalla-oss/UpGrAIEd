import { Router } from 'express'
import { requireRole } from '../middleware/auth.js'
import { razorpay, calculatePricing } from '../config/razorpay.js'
import { Reservation } from '../models/Reservation.js'
import crypto from 'crypto'

const router = Router()
router.use(requireRole('parent'))

// POST /api/payments/create-order
router.post('/create-order', async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({ phone: req.user.phone, status: 'approved' })
    const grade = reservation?.grade || 'Grade 8'
    const pricing = calculatePricing(grade)

    let orderId = 'dev_order_' + Date.now()
    let amount = pricing.total * 100

    try {
      const order = await razorpay.orders.create({ amount, currency: 'INR', receipt: 'rcpt_' + Date.now() })
      orderId = order.id
      amount = order.amount
    } catch {
      // Razorpay not configured — use dev values
    }

    res.json({
      orderId,
      amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_dev',
    })
  } catch (err) { next(err) }
})

// POST /api/payments/verify
router.post('/verify', async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (process.env.NODE_ENV !== 'production' && razorpay_signature === 'test_signature') {
      // Skip crypto check in dev simulate mode
    } else {
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret')
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
      const expected = hmac.digest('hex')
      if (expected !== razorpay_signature) {
        return res.status(400).json({ message: 'Payment verification failed' })
      }
    }

    await Reservation.findOneAndUpdate(
      { phone: req.user.phone, status: 'approved' },
      { status: 'paid' }
    )

    res.json({ success: true })
  } catch (err) { next(err) }
})

export default router
