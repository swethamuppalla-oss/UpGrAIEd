const router           = require('express').Router();
const authenticate     = require('../middleware/authenticate');
const authorize        = require('../middleware/authorize');
const parentController = require('../controllers/parentController');

router.use(authenticate, authorize('parent'));

router.get('/parent/dashboard', parentController.getDashboard);

module.exports = router;
