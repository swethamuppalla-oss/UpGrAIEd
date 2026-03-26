const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Otp = require('../models/Otp');

const SALT_ROUNDS = 10;

// --- OTP helpers ---

const generateOtpCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

const sendOtp = async (phone) => {
  const code = generateOtpCode();
  const hashedCode = await bcrypt.hash(code, SALT_ROUNDS);

  // Replace any existing OTP for this phone
  await Otp.findOneAndDelete({ phone });

  await Otp.create({
    phone,
    code: hashedCode,
    expiresAt: new Date(Date.now() + Otp.OTP_TTL_SECONDS * 1000),
  });

  // In production: dispatch SMS via provider here
  // For now: return plaintext code so caller can surface it in dev
  return { code };
};

const verifyOtp = async (phone, candidateCode) => {
  const record = await Otp.findOne({ phone });

  if (!record) {
    throw Object.assign(new Error('OTP not found or expired'), { statusCode: 400 });
  }

  const valid = await bcrypt.compare(candidateCode, record.code);
  if (!valid) {
    throw Object.assign(new Error('Invalid OTP'), { statusCode: 400 });
  }

  // Consume OTP immediately — single-use
  await record.deleteOne();

  return true;
};

// --- JWT helpers ---

const signToken = (user) =>
  jwt.sign(
    { sub: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// --- Main auth flows ---

const sendOtpForPhone = async (phone) => {
  // Ensure user exists (must be pre-created by admin or registration flow)
  const user = await User.findOne({ phone, isActive: true });
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  return sendOtp(phone);
};

const verifyOtpAndLogin = async (phone) => {
  const user = await User.findOne({ phone, isActive: true });
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  const token = signToken(user);

  // Enforce single active session — overwrite previous token reference
  user.activeSessionToken = token;
  await user.save();

  return { token, user: { id: user._id, name: user.name, role: user.role } };
};

module.exports = { sendOtpForPhone, verifyOtpAndLogin, verifyOtp };
