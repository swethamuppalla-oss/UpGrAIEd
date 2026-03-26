const authService = require('../services/authService');

const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: { message: 'phone is required' } });
    }

    const result = await authService.sendOtpForPhone(phone);

    const response = { message: 'OTP sent' };
    // Expose OTP in development only — never in production
    if (process.env.NODE_ENV === 'development') {
      response.otp = result.code;
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: { message: 'phone and otp are required' } });
    }

    // Verify the OTP first, then issue token
    await authService.verifyOtp(phone, otp);
    const { token, user } = await authService.verifyOtpAndLogin(phone);

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendOtp, verifyOtp };
