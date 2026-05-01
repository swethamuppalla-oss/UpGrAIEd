import { Router } from 'express'
import { sendOtp, verifyOtp, login, demoLogin } from '../controllers/authController.js'

const router = Router()

router.post('/send-otp',    sendOtp)
router.post('/verify-otp',  verifyOtp)
router.post('/login',       login)
router.post('/demo-login',  demoLogin)

export default router
