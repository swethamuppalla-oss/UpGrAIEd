import { Router } from 'express'
import { sendOtp, verifyOtp, adminLogin, demoLogin } from '../controllers/authController.js'

const router = Router()

router.post('/send-otp',    sendOtp)
router.post('/verify-otp',  verifyOtp)
router.post('/admin-login', adminLogin)
router.post('/demo-login',  demoLogin)

export default router
