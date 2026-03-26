const authService = require('../services/authService');

const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: { message: 'email is required' } });
    }

    const result = await authService.sendOtp(email);

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
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: { message: 'email and otp are required' } });
    }

    const { token, user } = await authService.verifyOtp(email, otp);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendOtp, verifyOtp };
