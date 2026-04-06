const jwt       = require('jsonwebtoken');
const User      = require('../models/User');
const authService = require('../services/authService');

const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: { message: 'email is required' } });
    }

    const result = await authService.sendOtpForEmail(email.toLowerCase().trim());

    const response = { message: 'OTP sent to your email' };
    if (process.env.NODE_ENV === 'development') response.otp = result.code;

    res.json(response);
  } catch (err) {
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, deviceId } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: { message: 'email and otp are required' } });
    }

    await authService.verifyOtp(email.toLowerCase().trim(), otp);
    const { token, user } = await authService.verifyOtpAndLogin(
      email.toLowerCase().trim(),
      deviceId || null
    );

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { message: 'email and password are required' } });
    }

    const { token, user } = await authService.adminLogin(
      email.toLowerCase().trim(),
      password
    );

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

// Demo user definitions — upserted on every call so they always exist
const DEMO_USERS = {
  student: { name: 'Arjun Kumar',  email: 'demo-student@upgraied.com', role: 'student' },
  parent:  { name: 'Priya Sharma', email: 'demo-parent@upgraied.com',  role: 'parent'  },
  creator: { name: 'Rahul Mehta',  email: 'demo-creator@upgraied.com', role: 'creator' },
  admin:   { name: 'Admin',        email: 'admin@upgraied.com',        role: 'admin'   },
};

const demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role || !DEMO_USERS[role]) {
      return res.status(400).json({ error: { message: 'Invalid demo role' } });
    }

    const demoData = DEMO_USERS[role];

    // Upsert — create if missing, update name/role if exists
    const user = await User.findOneAndUpdate(
      { email: demoData.email },
      { $set: { name: demoData.name, role: demoData.role, isActive: true } },
      { upsert: true, new: true, select: '+activeSessionToken' }
    );

    // Sign JWT (sub = user._id, consistent with authenticate middleware)
    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Persist session token (single-session enforcement)
    user.activeSessionToken = token;
    await user.save();

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendOtp, verifyOtp, adminLogin, demoLogin, logout };
