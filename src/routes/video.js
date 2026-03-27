const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const videoProgressController = require('../controllers/videoProgressController');

router.post('/videos/:id/progress', authenticate, videoProgressController.updateProgress);

module.exports = router;
