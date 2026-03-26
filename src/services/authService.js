const jwt = require('jsonwebtoken');
const User = require('../models/User');

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

// --- OTP helpers ---

const generateOtpCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

// --- JWT helper ---

const signToken = (user) =>
  jwt.sign(
    { sub: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// --- POST /auth/send-otp ---

const sendOtp = async (email) => {
  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  const code = generateOtpCode();

  // Store plaintext OTP + expiry directly on the user document
  user.otp = code;
  user.otpExpiry = new Date(Date.now() + OTP_TTL_MS);
  await user.save();

  // In production: send email/SMS here
  // In development: return OTP in response
  return { code };
};

// --- POST /auth/verify-otp ---

const verifyOtp = async (email, candidateOtp) => {
  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  if (!user.otp || !user.otpExpiry) {
    throw Object.assign(new Error('OTP not requested'), { statusCode: 400 });
  }

  if (new Date() > user.otpExpiry) {
    // Clear expired OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    throw Object.assign(new Error('OTP expired'), { statusCode: 400 });
  }

  if (user.otp !== candidateOtp) {
    throw Object.assign(new Error('Invalid OTP'), { statusCode: 400 });
  }

  // Consume OTP — single use
  user.otp = null;
  user.otpExpiry = null;
  user.isVerified = true;

  // Enforce single active session — overwrite any previous token
  const token = signToken(user);
  user.activeSessionToken = token;

  await user.save();

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

module.exports = { sendOtp, verifyOtp };
