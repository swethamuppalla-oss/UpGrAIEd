const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const courseController = require('../controllers/courseController');

router.get('/programs', authenticate, courseController.listPrograms);
router.get('/levels/:programId', authenticate, courseController.getLevelsByProgram);
router.get('/modules/:levelId', authenticate, courseController.getModulesByLevel);
router.get('/videos/:moduleId', authenticate, courseController.getVideosByModule);

module.exports = router;
