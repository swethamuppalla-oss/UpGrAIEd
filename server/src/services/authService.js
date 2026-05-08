import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Otp from '../models/Otp.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const generateOtpCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

const sendOtp = async (phone) => {
  const code = generateOtpCode();
  const hashedCode = await bcrypt.hash(code, SALT_ROUNDS);

  await Otp.findOneAndDelete({ phone });

  await Otp.create({
    phone,
    code: hashedCode,
    expiresAt: new Date(Date.now() + Otp.OTP_TTL_SECONDS * 1000),
  });

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

  await record.deleteOne();
  return true;
};

const getRefreshSecret = () =>
  process.env.JWT_REFRESH_SECRET || `${JWT_SECRET}:refresh`;

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const signAccessToken = (user) =>
  jwt.sign(
    { userId: String(user._id || user.id), role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

const signRefreshToken = (user) =>
  jwt.sign(
    { userId: String(user._id), role: user.role, type: 'refresh' },
    getRefreshSecret(),
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

const publicUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: REFRESH_COOKIE_MAX_AGE,
  path: '/api/auth',
});

export const clearRefreshCookieOptions = () => ({
  ...getRefreshCookieOptions(),
  maxAge: 0,
});

const updateLoginMeta = (user) => {
  const now = new Date();
  const last = user.lastLoginAt ? new Date(user.lastLoginAt) : null;
  if (last) {
    const daysSince = (now - last) / (1000 * 60 * 60 * 24);
    if (daysSince >= 2) user.loginStreak = 1;
    else if (daysSince >= 1) user.loginStreak = (user.loginStreak || 0) + 1;
  } else {
    user.loginStreak = 1;
  }
  user.lastLoginAt = now;
};

const issueSession = async (user) => {
  const token = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.activeSessionToken = token;
  user.activeRefreshTokenHash = hashToken(refreshToken);
  user.refreshTokenExpiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE);
  updateLoginMeta(user);
  await user.save();

  return { token, refreshToken, user: publicUser(user) };
};

export const sendOtpForPhone = async (identifier) => {
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

  if (candidateCode) {
    const phone = identifier.includes('@') ? user.phone || identifier : identifier;
    await verifyOtp(phone, candidateCode);
  }

  return issueSession(user);
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email, isActive: true }).select('+password +activeRefreshTokenHash');
  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  return issueSession(user);
};

const DEMO_IDS = {
  student: 'demo_student_id',
  parent:  'demo_parent_id',
  admin:   'demo_admin_id',
};

const makeSyntheticSession = (role) => {
  const id = DEMO_IDS[role];
  const fakeUser = { _id: id, id, role };
  const token = jwt.sign({ userId: id, role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId: id, role, type: 'refresh' }, getRefreshSecret(), { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  return {
    token,
    refreshToken,
    user: { id, _id: id, name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`, email: `demo_${role}@upgraied.dev`, role },
  };
};

export const demoLogin = async (role) => {
  const allowedRoles = ['student', 'parent', 'admin'];
  if (!allowedRoles.includes(role)) {
    throw Object.assign(new Error('Invalid demo role'), { statusCode: 400 });
  }

  try {
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

      if (role === 'parent') {
        let child = await User.findOne({ email: 'demo_student@upgraied.dev' });
        if (!child) {
          child = await User.create({
            name: 'Demo Student',
            email: 'demo_student@upgraied.dev',
            phone: '00000000',
            role: 'student',
            password: hashedPassword,
            isActive: true,
            parentId: user._id,
          });
        } else {
          child.parentId = user._id;
          await child.save();
        }
        user.children = [child._id];
        await user.save();
      } else if (role === 'student') {
        let parent = await User.findOne({ email: 'demo_parent@upgraied.dev' });
        if (!parent) {
          parent = await User.create({
            name: 'Demo Parent',
            email: 'demo_parent@upgraied.dev',
            phone: '00000001',
            role: 'parent',
            password: hashedPassword,
            isActive: true,
            children: [user._id],
          });
        } else if (!parent.children.includes(user._id)) {
          parent.children.push(user._id);
          await parent.save();
        }
        user.parentId = parent._id;
        await user.save();
      }
    }

    return issueSession(user);
  } catch (err) {
    console.error('demoLogin DB error — falling back to synthetic token:', err.message);
    return makeSyntheticSession(role);
  }
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw Object.assign(new Error('Refresh token missing'), { statusCode: 401 });
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, getRefreshSecret());
  } catch {
    throw Object.assign(new Error('Refresh token invalid or expired'), { statusCode: 401 });
  }

  if (payload.type !== 'refresh') {
    throw Object.assign(new Error('Invalid token type'), { statusCode: 401 });
  }

  const user = await User.findById(payload.userId).select('+activeRefreshTokenHash +refreshTokenExpiresAt');
  if (!user || !user.isActive) {
    throw Object.assign(new Error('User not found'), { statusCode: 401 });
  }

  if (!user.activeRefreshTokenHash || user.activeRefreshTokenHash !== hashToken(refreshToken)) {
    throw Object.assign(new Error('Refresh token revoked'), { statusCode: 401 });
  }

  if (!user.refreshTokenExpiresAt || user.refreshTokenExpiresAt <= new Date()) {
    throw Object.assign(new Error('Refresh token expired'), { statusCode: 401 });
  }

  const token = signAccessToken(user);
  user.activeSessionToken = token;
  await user.save();

  return { token, user: publicUser(user) };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;

  try {
    const payload = jwt.verify(refreshToken, getRefreshSecret());
    await User.findByIdAndUpdate(payload.userId, {
      $set: {
        activeSessionToken: null,
        activeRefreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    });
  } catch {
    // Logout is idempotent; clearing the cookie is enough for bad tokens.
  }
};
