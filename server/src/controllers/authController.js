const authService = require('../services/authService');

const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: { message: 'email is required' } });
    }

    const result = await authService.sendOtpForEmail(email.toLowerCase().trim());

    const response = { message: 'OTP sent to your email' };
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
    const { email, otp, deviceId } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: { message: 'email and otp are required' } });
    }

    await authService.verifyOtp(email.toLowerCase().trim(), otp);
    const { token, user } = await authService.verifyOtpAndLogin(
      email.toLowerCase().trim(),
      deviceId || null
    );

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { message: 'email and password are required' } });
    }

    const { token, user } = await authService.adminLogin(
      email.toLowerCase().trim(),
      password
    );

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

const demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: { message: 'role is required' } });
    }

    const { token, user } = await authService.demoLogin(role);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendOtp, verifyOtp, adminLogin, demoLogin, logout };
