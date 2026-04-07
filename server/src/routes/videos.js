const router = require('express').Router();
const videoController = require('../controllers/videoController');

router.get('/:id/stream-url', videoController.getStreamUrl);
router.get('/:id/my-progress', videoController.getMyProgress);
router.post('/:id/progress', videoController.postProgress);

module.exports = router;
