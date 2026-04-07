const Razorpay = require('razorpay');

// Lazy init — keys are only required in production / when payment routes are hit
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const GRADE_PRICES = {
  'Grade 6': 7999,
  'Grade 7': 7499,
  'Grade 8': 6999,
  'Grade 9': 5999,
  'Grade 10': 4999,
  'Grade 11': 3999,
  'Grade 12': 2499,
};

const GST_RATE = 0.18;

const calculatePricing = (grade) => {
  const base = GRADE_PRICES[grade] || 6999;
  const gst = Math.round(base * GST_RATE);
  const total = base + gst;
  return { base, gst, total };
};

module.exports = {
  razorpay,
  GRADE_PRICES,
  GST_RATE,
  calculatePricing,
};
