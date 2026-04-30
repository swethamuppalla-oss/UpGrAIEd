import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_test',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret',
})

export const GRADE_PRICES = {
  'Grade 6': 7999, 'Grade 7': 7499, 'Grade 8': 6999,
  'Grade 9': 5999, 'Grade 10': 4999,
  'Grade 11': 3999, 'Grade 12': 2499,
}

export const GST_RATE = 0.19

export const calculatePricing = (grade) => {
  const base = GRADE_PRICES[grade] || 6999
  const gst = Math.round(base * GST_RATE)
  const total = base + gst
  return { base, gst, total }
}
