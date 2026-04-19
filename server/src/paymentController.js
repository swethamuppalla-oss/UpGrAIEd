import crypto from 'crypto'
import { razorpay, calculatePricing } from '../config/razorpay.js'
import { Reservation } from '../models/Reservation.js'
import { Transaction } from '../models/Transaction.js'
import { Enrollment } from '../models/Enrollment.js'

export const createOrder = async (req, res) => {
  try {
    const userEmail = req.user.email
    const reservation = await Reservation.findOne({ email: userEmail, status: 'approved' })
    if (!reservation) return res.status(404).json({ message: 'No approved reservation found' })

    const pricing = calculatePricing(reservation.grade)

    const options = {
      amount: pricing.total * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    }

    const order = await razorpay.orders.create(options)
    
    // Save pending transaction
    await Transaction.create({
      userEmail,
      orderId: order.id,
      amount: pricing.total,
      currency: 'INR',
      status: 'pending'
    })

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create payment order' })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    
    if (process.env.NODE_ENV === 'development' && razorpay_signature === 'test_signature') {
      // Skip crypto check in full demo test
    } else {
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
      const expectedSignature = hmac.digest('hex')
      
      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: 'Payment verification failed' })
      }
    }
    
    await Transaction.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: 'paid', paymentId: razorpay_payment_id }
    )

    const reservation = await Reservation.findOneAndUpdate(
      { email: req.user.email, status: 'approved' },
      { status: 'paid' }
    )

    if (reservation) {
      await Enrollment.create({
        userRef: req.user._id,
        reservationId: reservation._id,
        unlockedLevels: [1]
      })
    }

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error verifying payment' })
  }
}
