const router = require('express').Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;
