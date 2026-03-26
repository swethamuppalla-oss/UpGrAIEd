const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const enrollmentController = require('../controllers/enrollmentController');

// Parent: reserve a seat
router.post('/reserve', authenticate, authorize('parent'), enrollmentController.reserve);

// Parent: view own reservations
router.get('/my-reservations', authenticate, authorize('parent'), enrollmentController.myReservations);

module.exports = router;
