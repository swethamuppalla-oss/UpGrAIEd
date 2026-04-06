const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const adminController = require('../controllers/adminController');
const enrollmentController = require('../controllers/enrollmentController');

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/admin/users', adminController.listUsers);
router.get('/admin/payments', adminController.listPayments);
router.get('/admin/analytics', adminController.getAnalytics);

// Reservations already implemented in enrollmentController — expose here under admin prefix
router.get('/admin/reservations', enrollmentController.listReservations);
router.post('/admin/approve/:enrollmentId', enrollmentController.approve);

module.exports = router;
