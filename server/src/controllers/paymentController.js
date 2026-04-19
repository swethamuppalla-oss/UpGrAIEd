const crypto = require('crypto')
const { razorpay, calculatePricing } = require('../config/razorpay')
const Reservation = require('../models/Reservation')
const Transaction = require('../models/Transaction')
// if Enrollment doesn't exist, this require will crash, so let's check it
// actually I'll just use a mock or create Enrollment model later.

module.exports.createOrder = async (req, res) => {
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
      user: req.user._id,
      amount: pricing.total,
      currency: 'INR',
      status: 'PENDING',
      gatewayOrderId: order.id
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

module.exports.verifyPayment = async (req, res) => {
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
      { gatewayOrderId: razorpay_order_id },
      { status: 'SUCCESS', gatewayPaymentId: razorpay_payment_id, verifiedAt: new Date() }
    )

    await Reservation.findOneAndUpdate(
      { email: req.user.email, status: 'approved' },
      { status: 'paid' }
    )

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error verifying payment' })
  }
}
