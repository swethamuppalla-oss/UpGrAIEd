const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const progressionController = require('../controllers/progressionController');

// Students complete modules; parents can also mark on behalf of their child (if needed later)
router.post(
  '/progress/complete',
  authenticate,
  authorize('student'),
  progressionController.completeModule
);

module.exports = router;
