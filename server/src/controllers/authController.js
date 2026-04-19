import { sendOtpForPhone, verifyOtpAndLogin, adminLogin as adminLoginSvc, demoLogin as demoLoginSvc } from '../services/authService.js'

export const sendOtp = async (req, res, next) => {
  try {
    const identifier = req.body.phone || req.body.email
    if (!identifier) return res.status(400).json({ message: 'phone or email is required' })
    const result = await sendOtpForPhone(identifier)
    const response = { message: 'OTP sent' }
    if (process.env.NODE_ENV === 'development') response.otp = result.code
    res.json(response)
  } catch (err) { next(err) }
}

export const verifyOtp = async (req, res, next) => {
  try {
    const identifier = req.body.phone || req.body.email
    const { otp } = req.body
    if (!identifier || !otp) return res.status(400).json({ message: 'identifier and otp are required' })
    const data = await verifyOtpAndLogin(identifier, otp)
    res.json(data)
  } catch (err) { next(err) }
}

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'email and password required' })
    const data = await adminLoginSvc(email, password)
    res.json(data)
  } catch (err) { next(err) }
}

export const demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body
    if (!role) return res.status(400).json({ message: 'role is required' })
    const data = await demoLoginSvc(role)
    res.json(data)
  } catch (err) { next(err) }
}
