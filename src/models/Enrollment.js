const mongoose = require('mongoose');

const STATUSES = ['reserved', 'approved', 'active'];
const PAYMENT_STATUSES = ['pending', 'paid'];

const enrollmentSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'reserved',
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: 'pending',
    },
    // Admin who approved — populated on approval
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: { type: Date, default: null },
    activatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// One active enrollment per parent+student at a time
enrollmentSchema.index(
  { parentId: 1, studentName: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['reserved', 'approved', 'active'] } },
  }
);

enrollmentSchema.statics.STATUSES = STATUSES;
enrollmentSchema.statics.PAYMENT_STATUSES = PAYMENT_STATUSES;

module.exports = mongoose.model('Enrollment', enrollmentSchema);
