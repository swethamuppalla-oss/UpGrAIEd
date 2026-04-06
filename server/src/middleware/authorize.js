// Usage: router.get('/admin-only', authenticate, authorize('admin'), handler)
//        router.get('/multi',      authenticate, authorize('admin', 'parent'), handler)

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: { message: 'Forbidden: insufficient role' } });
  }
  next();
};

module.exports = authorize;
