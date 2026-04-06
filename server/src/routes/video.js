const router = require('express').Router();
const multer = require('multer');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const videoProgressController = require('../controllers/videoProgressController');
const videoController = require('../controllers/videoController');

// Store uploaded files in /tmp before sending to Bunny.net
const upload = multer({ dest: '/tmp/' });

// Student: update watch progress
router.post(
  '/videos/:id/progress',
  authenticate,
  authorize('student'),
  videoProgressController.updateProgress
);

// Student: get stream + embed URLs
router.get(
  '/videos/:id/stream',
  authenticate,
  authorize('student'),
  videoController.getVideoUrls
);

// Admin: upload a video to Bunny.net
router.post(
  '/admin/videos',
  authenticate,
  authorize('admin'),
  upload.single('video'),
  videoController.uploadVideo
);

// Admin: list videos
router.get(
  '/admin/videos',
  authenticate,
  authorize('admin'),
  videoController.listVideos
);

// Admin: delete a video
router.delete(
  '/admin/videos/:id',
  authenticate,
  authorize('admin'),
  videoController.deleteVideo
);

module.exports = router;
