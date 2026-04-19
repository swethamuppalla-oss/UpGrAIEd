const { calculatePricing } = require('../config/razorpay')
const Reservation = require('../models/Reservation')
const Transaction = require('../models/Transaction')

module.exports.getPaymentStatus = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ email: req.user.email })

    if (!reservation) {
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          status: 'approved',
          parentName: req.user.name,
          childName: 'Demo Student',
          grade: 'Grade 8',
          email: req.user.email,
          phone: '+91 98765 43210',
          programme: 'Junior',
          pricing: calculatePricing('Grade 8')
        })
      }
      return res.json({ status: 'none' })
    }

    if (reservation.status === 'paid') {
       return res.json({ status: 'paid' })
    }

    if (reservation.status === 'pending') {
       return res.json({ status: 'reserved' })
    }

    if (reservation.status === 'approved') {
       return res.json({
         status: 'approved',
         parentName: reservation.parentName,
         childName: reservation.childName,
         grade: reservation.grade,
         email: reservation.email,
         phone: reservation.phone,
         programme: parseInt(reservation.grade.split(' ')[1]) <= 8 ? 'Junior' : 'Senior',
         pricing: calculatePricing(reservation.grade)
       })
    }

    res.json({ status: 'none' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
