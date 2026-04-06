const router       = require('express').Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

router.post('/send-otp',    authController.sendOtp);
router.post('/verify-otp',  authController.verifyOtp);
router.post('/admin-login', authController.adminLogin);
router.post('/demo-login',  authController.demoLogin);
router.post('/logout',      authenticate, authController.logout);

// Token verification test — GET /api/auth/me
// Browser console: fetch('/api/auth/me',{headers:{Authorization:'Bearer '+localStorage.getItem('token')}}).then(r=>r.json()).then(console.log)
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
