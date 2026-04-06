const router = require('express').Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

router.post('/send-otp',    authController.sendOtp);
router.post('/verify-otp',  authController.verifyOtp);
router.post('/admin-login', authController.adminLogin);
router.post('/demo-login',  authController.demoLogin);
router.post('/logout',      authenticate, authController.logout);

module.exports = router;
