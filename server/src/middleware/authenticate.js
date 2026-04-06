const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: { message: 'No token provided' } });
    }

    const token = authHeader.slice(7);
    if (!token) {
      return res.status(401).json({ error: { message: 'No token provided' } });
    }

    // Dev-only: allow offline demo tokens (demo_token_<role>_<timestamp>)
    if (process.env.NODE_ENV !== 'production' && token.startsWith('demo_token_')) {
      const parts = token.split('_');
      const role  = parts[2] || 'student';
      const names = { student: 'Arjun Kumar', parent: 'Priya Sharma', creator: 'Rahul Mehta', admin: 'Admin' };
      req.user = { id: `demo-${role}`, role, name: names[role] || 'Demo User' };
      return next();
    }

    // Normal JWT verification
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid or expired token';
      return res.status(401).json({ error: { message: msg } });
    }

    // JWT signed with { sub: user._id, role }
    const user = await User.findById(payload.sub).select('+activeSessionToken');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: { message: 'User not found or inactive' } });
    }

    // Single-session enforcement
    if (user.activeSessionToken !== token) {
      return res.status(401).json({ error: { message: 'Session superseded. Please log in again.' } });
    }

    req.user = { id: user._id, role: user.role, name: user.name };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
