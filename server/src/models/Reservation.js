const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    parentName: { type: String, required: true, trim: true },
    childName: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    city: { type: String, trim: true },
    source: { type: String, trim: true },
    status: {
      type: String,
      enum: ['reserved', 'approved', 'paid'],
      default: 'reserved',
    },
  },
  { timestamps: true }
);

reservationSchema.index({ phone: 1 }, { unique: true });

module.exports = mongoose.model('Reservation', reservationSchema);
