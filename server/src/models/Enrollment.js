const mongoose = require('mongoose');

const STATUSES = ['RESERVED', 'APPROVED', 'ACTIVE', 'REJECTED'];

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: true,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'RESERVED',
    },
    // Populated once admin approves
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: { type: Date, default: null },
    // Populated on payment success (Step 4)
    paymentEnabledAt: { type: Date, default: null },
    activatedAt: { type: Date, default: null },
    unlockedLevels: {
      type: [Number],
      default: [1],
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// One active enrollment per student at a time
enrollmentSchema.index(
  { student: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['RESERVED', 'APPROVED', 'ACTIVE'] } },
  }
);

enrollmentSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model('Enrollment', enrollmentSchema);
