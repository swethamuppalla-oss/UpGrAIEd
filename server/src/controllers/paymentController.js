const crypto = require('crypto');
const Parent = require('../models/Parent');
const Reservation = require('../models/Reservation');
const Transaction = require('../models/Transaction');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const User = require('../models/User');
const { razorpay, calculatePricing } = require('../config/razorpay');

const getParentReservation = async (userId) => {
  const parent = await Parent.findOne({ user: userId });
  if (!parent) return { parent: null, reservation: null };

  const reservation = await Reservation.findOne({ email: parent.email }).sort({ createdAt: -1 });
  return { parent, reservation };
};

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { parent, reservation } = await getParentReservation(userId);

    if (!parent || !reservation || reservation.status !== 'approved') {
      return res.status(400).json({
        error: { message: 'No approved reservation found' },
      });
    }

    const { base, gst, total } = calculatePricing(reservation.grade);

    const order = await razorpay.orders.create({
      amount: total * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        grade: reservation.grade,
        childName: reservation.childName,
        parentName: reservation.parentName,
      },
    });

    await Transaction.findOneAndUpdate(
      { parentId: userId, status: { $in: ['PENDING', 'pending'] } },
      {
        user: userId,
        parentId: userId,
        orderId: order.id,
        gatewayOrderId: order.id,
        amount: total,
        baseAmount: base,
        gstAmount: gst,
        grade: reservation.grade,
        currency: order.currency,
        status: 'PENDING',
      },
      { upsert: true, new: true }
    );

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: { message: err.message } });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const userId = req.user.id;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        error: { message: 'Payment verification failed' },
      });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { $or: [{ orderId: razorpay_order_id }, { gatewayOrderId: razorpay_order_id }] },
      {
        status: 'SUCCESS',
        paymentId: razorpay_payment_id,
        gatewayPaymentId: razorpay_payment_id,
        paidAt: new Date(),
        verifiedAt: new Date(),
      },
      { new: true }
    );

    const { parent, reservation } = await getParentReservation(userId);
    if (!parent || !reservation) {
      return res.status(400).json({ error: { message: 'Parent reservation not found' } });
    }

    reservation.status = 'paid';
    await reservation.save();

    let student = await Student.findOne({ parent: parent._id });
    if (!student) {
      const childEmail = `${reservation.childName.toLowerCase().replace(/\s+/g, '.')}+${Date.now()}@upgraied.local`;
      const studentUser = await User.create({
        email: childEmail,
        name: reservation.childName,
        role: 'student',
        isActive: true,
      });

      student = await Student.create({
        user: studentUser._id,
        parent: parent._id,
        name: reservation.childName,
        grade: reservation.grade,
      });
    }

    await Enrollment.findOneAndUpdate(
      { student: student._id, parent: parent._id },
      {
        student: student._id,
        parent: parent._id,
        status: 'ACTIVE',
        activatedAt: new Date(),
        paymentEnabledAt: new Date(),
        unlockedLevels: [1],
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Payment verified and access granted',
      transactionId: transaction?._id || null,
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: { message: err.message } });
  }
};

module.exports = {
  createPayment: createOrder,
  createOrder,
  verifyPayment,
};
