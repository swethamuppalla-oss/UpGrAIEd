const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const progressionController = require('../controllers/progressionController');

router.post('/progress/complete', authenticate, progressionController.completeModule);

module.exports = router;
