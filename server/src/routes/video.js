const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const videoProgressController = require('../controllers/videoProgressController');

router.post(
  '/videos/:id/progress',
  authenticate,
  authorize('student'),
  videoProgressController.updateProgress
);

module.exports = router;
