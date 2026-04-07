const router      = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const ctrl         = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/admin/stats',            ctrl.getStats);
router.get('/admin/reservations',     ctrl.listReservations);
router.post('/admin/approve/:id',     ctrl.approveReservation);
router.get('/admin/payments',         ctrl.listPayments);
router.get('/admin/users',            ctrl.listUsers);
router.post('/admin/users/:id/block', ctrl.blockUser);
router.post('/admin/users/:id/unblock', ctrl.unblockUser);

// Legacy — kept for backward compat
router.get('/admin/analytics',        ctrl.getAnalytics);

module.exports = router;
