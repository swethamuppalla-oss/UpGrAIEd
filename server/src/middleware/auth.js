import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized, no token' })
  }

  const token = authHeader.split(' ')[1]

  if (process.env.NODE_ENV !== 'production' && token.startsWith('demo-token-')) {
    const role = token.split('demo-token-')[1]
    req.user = { _id: 'demo', role, name: 'Demo User', email: `demo-${role}@upgraied.com` }
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.sub || decoded.id)

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is blocked' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired' })
  }
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' })
  }
  next()
}
