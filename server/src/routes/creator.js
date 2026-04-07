const router = require('express').Router();
const multer = require('multer');
const creatorController = require('../controllers/creatorController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/stats', creatorController.getStats);
router.get('/videos', creatorController.getVideos);
router.post('/upload', upload.single('video'), creatorController.upload);

module.exports = router;
