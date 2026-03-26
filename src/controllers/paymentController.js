const paymentService = require('../services/paymentService');

const createPayment = async (req, res, next) => {
  try {
    const { enrollmentId, amount, currency } = req.body;

    if (!enrollmentId || amount === undefined) {
      return res.status(400).json({ error: { message: 'enrollmentId and amount are required' } });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: { message: 'amount must be a positive number' } });
    }

    const transaction = await paymentService.createPayment(req.user.id, {
      enrollmentId,
      amount,
      currency,
    });

    res.status(201).json({ transaction });
  } catch (err) {
    next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { transactionId, gatewayPaymentId, success } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: { message: 'transactionId is required' } });
    }

    const result = await paymentService.verifyPayment(req.user.id, {
      transactionId,
      gatewayPaymentId,
      success,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { createPayment, verifyPayment };
