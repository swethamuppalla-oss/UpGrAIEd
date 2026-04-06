const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const enrollmentController = require('../controllers/enrollmentController');

// Parent: reserve a seat
router.post('/reserve', authenticate, authorize('parent'), enrollmentController.reserve);

module.exports = router;
