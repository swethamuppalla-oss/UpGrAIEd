const Transaction = require('../models/Transaction');
const Enrollment = require('../models/Enrollment');
const Parent = require('../models/Parent');
const { activateEnrollment } = require('./enrollmentService');

// --- Create a pending transaction ---

const createPayment = async (userId, { enrollmentId, amount, currency }) => {
  const parent = await Parent.findOne({ user: userId });
  if (!parent) {
    throw Object.assign(new Error('Parent profile not found'), { statusCode: 404 });
  }

  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw Object.assign(new Error('Enrollment not found'), { statusCode: 404 });
  }

  // Confirm enrollment belongs to this parent
  if (!enrollment.parent.equals(parent._id)) {
    throw Object.assign(new Error('Enrollment does not belong to this parent'), { statusCode: 403 });
  }

  if (enrollment.status !== 'APPROVED') {
    throw Object.assign(
      new Error(`Payment not available for enrollment in status: ${enrollment.status}`),
      { statusCode: 409 }
    );
  }

  // Prevent duplicate pending transactions for the same enrollment
  const pending = await Transaction.findOne({ enrollment: enrollmentId, status: 'PENDING' });
  if (pending) {
    throw Object.assign(
      new Error('A pending transaction already exists for this enrollment'),
      { statusCode: 409 }
    );
  }

  // In production: call payment gateway here to create an order/intent
  // and store the returned gatewayOrderId.
  const transaction = await Transaction.create({
    user: userId,
    enrollment: enrollmentId,
    amount,
    currency: currency || 'INR',
    gatewayOrderId: `mock_order_${Date.now()}`,
  });

  return transaction;
};

// --- Verify payment and activate enrollment ---

const verifyPayment = async (userId, { transactionId, gatewayPaymentId, success }) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
  }

  if (!transaction.user.equals(userId)) {
    throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
  }

  if (transaction.status !== 'PENDING') {
    throw Object.assign(
      new Error(`Transaction already in status: ${transaction.status}`),
      { statusCode: 409 }
    );
  }

  // In production: verify signature from gateway callback here before trusting `success`
  const verified = Boolean(success);

  transaction.verifiedAt = new Date();
  transaction.gatewayPaymentId = gatewayPaymentId || null;

  if (verified) {
    transaction.status = 'SUCCESS';
    await transaction.save();
    const enrollment = await activateEnrollment(transaction.enrollment);
    return { transaction, enrollment };
  }

  transaction.status = 'FAILED';
  transaction.failureReason = 'Payment declined by gateway';
  await transaction.save();

  return { transaction, enrollment: null };
};

module.exports = { createPayment, verifyPayment };
