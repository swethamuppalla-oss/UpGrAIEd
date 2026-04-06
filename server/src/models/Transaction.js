const mongoose = require('mongoose');

const STATUSES = ['PENDING', 'SUCCESS', 'FAILED'];

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', trim: true },
    status: { type: String, enum: STATUSES, default: 'PENDING' },
    // Gateway reference — populated on verify
    gatewayOrderId: { type: String, trim: true, default: null },
    gatewayPaymentId: { type: String, trim: true, default: null },
    failureReason: { type: String, trim: true, default: null },
    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, status: 1 });
transactionSchema.index({ enrollment: 1 });

transactionSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model('Transaction', transactionSchema);
