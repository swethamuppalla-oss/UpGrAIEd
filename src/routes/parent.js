const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { getChild, getActivity, getBilling, getPaymentStatus } = require('../controllers/parentController');

const router = Router();

router.use(authenticate, authorize('parent'));

router.get('/child', getChild);
router.get('/activity', getActivity);
router.get('/billing', getBilling);
router.get('/payment-status', getPaymentStatus);

module.exports = router;
