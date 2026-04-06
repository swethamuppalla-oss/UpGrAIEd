const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: { message: 'No token provided' } });
    }

    const token = authHeader.slice(7);
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: { message: 'Invalid or expired token' } });
    }

    const user = await User.findById(payload.sub).select('+activeSessionToken');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: { message: 'User not found or inactive' } });
    }

    // Single-session enforcement — token must match the stored reference
    if (user.activeSessionToken !== token) {
      return res.status(401).json({ error: { message: 'Session superseded. Please log in again.' } });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
