const mongoose = require('mongoose');

const OTP_TTL_SECONDS = 5 * 60; // 5 minutes

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // MongoDB TTL — auto-deletes after expiresAt
  },
});

otpSchema.statics.OTP_TTL_SECONDS = OTP_TTL_SECONDS;

module.exports = mongoose.model('Otp', otpSchema);
