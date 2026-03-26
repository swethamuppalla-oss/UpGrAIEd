const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const paymentController = require('../controllers/paymentController');

router.post('/payment/create', authenticate, authorize('parent'), paymentController.createPayment);
router.post('/payment/verify', authenticate, authorize('parent'), paymentController.verifyPayment);

module.exports = router;
