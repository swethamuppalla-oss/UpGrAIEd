const router = require('express').Router();
const adminController = require('../controllers/adminController');

router.get('/stats', adminController.getStats);
router.get('/reservations', adminController.listReservations);
router.post('/approve/:id', adminController.approveReservation);
router.get('/payments', adminController.listPayments);
router.get('/users', adminController.listUsers);
router.post('/users/:id/block', adminController.blockUser);
router.post('/users/:id/unblock', adminController.unblockUser);

module.exports = router;
