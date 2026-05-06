import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized, no token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId || decoded.sub || decoded.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is blocked' })
    }

    req.auth = { userId: String(user._id), role: user.role }
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' })
    }
    res.status(401).json({ message: 'Token is invalid or expired', code: 'TOKEN_INVALID' })
  }
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' })
  }
  next()
}
