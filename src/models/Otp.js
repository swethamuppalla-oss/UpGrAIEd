const mongoose = require('mongoose');

const OTP_TTL_SECONDS = 5 * 60; // 5 minutes

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // MongoDB TTL index — auto-deletes after expiresAt
  },
});

otpSchema.statics.OTP_TTL_SECONDS = OTP_TTL_SECONDS;

module.exports = mongoose.model('Otp', otpSchema);
