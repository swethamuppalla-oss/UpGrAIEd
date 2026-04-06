const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Otp = require('../models/Otp');

const SALT_ROUNDS = 10;

// Demo user seeds — used only for POST /api/auth/demo-login
const DEMO_USERS = {
  student: { email: 'demo-student@upgraied.com', name: 'Arjun Kumar',  role: 'student' },
  parent:  { email: 'demo-parent@upgraied.com',  name: 'Priya Sharma', role: 'parent'  },
  creator: { email: 'demo-creator@upgraied.com', name: 'Rahul Mehta',  role: 'creator' },
  admin:   { email: 'admin@upgraied.com',         name: 'Admin',        role: 'admin'   },
};

// ── OTP helpers ───────────────────────────────────────────────────────────────

const generateOtpCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

const sendOtp = async (email) => {
  const code = generateOtpCode();
  const hashedCode = await bcrypt.hash(code, SALT_ROUNDS);

  // Replace any existing OTP for this email (one OTP at a time)
  await Otp.findOneAndDelete({ email });

  await Otp.create({
    email,
    code: hashedCode,
    expiresAt: new Date(Date.now() + Otp.OTP_TTL_SECONDS * 1000),
  });

  // Production: dispatch via MSG91 here
  // Development: return plaintext so controller can surface it
  return { code };
};

const verifyOtp = async (email, candidateCode) => {
  const record = await Otp.findOne({ email });

  if (!record) {
    throw Object.assign(new Error('OTP not found or expired'), { statusCode: 400 });
  }

  const valid = await bcrypt.compare(candidateCode, record.code);
  if (!valid) {
    throw Object.assign(new Error('Invalid OTP'), { statusCode: 400 });
  }

  // Consume immediately — single-use
  await record.deleteOne();
  return true;
};

// ── JWT ───────────────────────────────────────────────────────────────────────

const signToken = (user) =>
  jwt.sign(
    { sub: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ── Auth flows ────────────────────────────────────────────────────────────────

const sendOtpForEmail = async (email) => {
  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    throw Object.assign(new Error('No account found for this email'), { statusCode: 404 });
  }
  if (user.role === 'admin') {
    throw Object.assign(new Error('Admins must use password login'), { statusCode: 400 });
  }
  return sendOtp(email);
};

const verifyOtpAndLogin = async (email, deviceId) => {
  const user = await User.findOne({ email, isActive: true }).select('+activeSessionToken');
  if (!user) {
    throw Object.assign(new Error('No account found for this email'), { statusCode: 404 });
  }

  // Device tracking — max 2 devices
  if (deviceId && !user.deviceIds.includes(deviceId)) {
    if (user.deviceIds.length >= 2) {
      throw Object.assign(
        new Error('Maximum device limit (2) reached. Please log out from another device.'),
        { statusCode: 403 }
      );
    }
    user.deviceIds.push(deviceId);
  }

  const token = signToken(user);

  // Single active session — overwrite previous token
  user.activeSessionToken = token;
  await user.save();

  return { token, user: { id: user._id, name: user.name, role: user.role, email: user.email } };
};

const adminLogin = async (email, password) => {
  const user = await User.findOne({ email, role: 'admin', isActive: true })
    .select('+password +activeSessionToken');

  if (!user || !user.password) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  const token = signToken(user);
  user.activeSessionToken = token;
  await user.save();

  return { token, user: { id: user._id, name: user.name, role: user.role, email: user.email } };
};

const demoLogin = async (role) => {
  const seed = DEMO_USERS[role];
  if (!seed) {
    throw Object.assign(new Error('Invalid demo role'), { statusCode: 400 });
  }

  // Find or create the demo user
  let user = await User.findOne({ email: seed.email }).select('+activeSessionToken');
  if (!user) {
    user = await User.create({ email: seed.email, name: seed.name, role: seed.role });
    user = await User.findById(user._id).select('+activeSessionToken');
  }

  const token = signToken(user);
  user.activeSessionToken = token;
  await user.save();

  return { token, user: { id: user._id, name: user.name, role: user.role, email: user.email } };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { activeSessionToken: null });
};

module.exports = {
  sendOtpForEmail,
  verifyOtp,
  verifyOtpAndLogin,
  adminLogin,
  demoLogin,
  logout,
};
