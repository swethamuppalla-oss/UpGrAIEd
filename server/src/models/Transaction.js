const mongoose = require('mongoose');

const STATUSES = ['PENDING', 'SUCCESS', 'FAILED', 'pending', 'paid', 'failed'];

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: false,
      default: null,
    },
    amount: { type: Number, required: true, min: 0 },
    baseAmount: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    grade: { type: String, trim: true, default: null },
    currency: { type: String, default: 'INR', trim: true },
    status: { type: String, enum: STATUSES, default: 'PENDING' },
    // Gateway reference — populated on verify
    orderId: { type: String, trim: true, default: null },
    paymentId: { type: String, trim: true, default: null },
    gatewayOrderId: { type: String, trim: true, default: null },
    gatewayPaymentId: { type: String, trim: true, default: null },
    failureReason: { type: String, trim: true, default: null },
    verifiedAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, status: 1 });
transactionSchema.index({ parentId: 1, status: 1 });
transactionSchema.index({ enrollment: 1 });

transactionSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model('Transaction', transactionSchema);
