import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Otp from '../models/Otp.js';

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

// --- Companion: track login time + streak ---

const updateLoginMeta = (user) => {
  const now = new Date();
  const last = user.lastLoginAt ? new Date(user.lastLoginAt) : null;
  if (last) {
    const msSince = now - last;
    const daysSince = msSince / (1000 * 60 * 60 * 24);
    if (daysSince < 1) {
      // Same day — keep streak as-is
    } else if (daysSince < 2) {
      user.loginStreak = (user.loginStreak || 0) + 1;
    } else {
      user.loginStreak = 1; // Reset after gap
    }
  } else {
    user.loginStreak = 1;
  }
  user.lastLoginAt = now;
};

// --- Main auth flows ---

export const sendOtpForPhone = async (identifier) => {
  // Accept phone or email
  const query = identifier.includes('@')
    ? { email: identifier, isActive: true }
    : { phone: identifier, isActive: true };

  const user = await User.findOne(query);
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  return sendOtp(identifier.includes('@') ? user.phone || identifier : identifier);
};

export const verifyOtpAndLogin = async (identifier, candidateCode) => {
  const query = identifier.includes('@')
    ? { email: identifier, isActive: true }
    : { phone: identifier, isActive: true };

  const user = await User.findOne(query);
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  // Verify OTP if a code was provided
  if (candidateCode) {
    const phone = identifier.includes('@') ? user.phone || identifier : identifier;
    await verifyOtp(phone, candidateCode);
  }

  const token = signToken(user);

  // Enforce single active session — overwrite previous token reference
  user.activeSessionToken = token;
  updateLoginMeta(user);
  await user.save();

  return { token, user: { id: user._id, name: user.name, role: user.role } };
};

export const adminLogin = async (email, password) => {
  const user = await User.findOne({ email, role: 'admin', isActive: true }).select('+password');
  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  const token = signToken(user);
  user.activeSessionToken = token;
  updateLoginMeta(user);
  await user.save();

  return { token, user: { id: user._id, name: user.name, role: user.role } };
};

export const demoLogin = async (role) => {
  const allowedRoles = ['student', 'parent', 'creator', 'admin'];
  if (!allowedRoles.includes(role)) {
    throw Object.assign(new Error('Invalid demo role'), { statusCode: 400 });
  }

  // Find or create a demo user for this role
  let user = await User.findOne({ email: `demo_${role}@upgraied.dev`, isActive: true });
  if (!user) {
    const hashedPassword = await bcrypt.hash('demo_password_123', SALT_ROUNDS);
    user = await User.create({
      name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: `demo_${role}@upgraied.dev`,
      phone: `0000000${allowedRoles.indexOf(role)}`,
      role,
      password: hashedPassword,
      isActive: true,
    });
  }

  const token = signToken(user);
  user.activeSessionToken = token;
  updateLoginMeta(user);
  await user.save();

  return { token, user: { id: user._id, name: user.name, role: user.role } };
};
