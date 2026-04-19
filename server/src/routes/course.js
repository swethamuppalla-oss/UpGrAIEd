const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const courseController = require('../controllers/courseController');

// All content endpoints require an authenticated, active-session user.
// No further role restriction — any enrolled user (parent/student/admin) may browse.

router.get('/programs', authenticate, courseController.listPrograms);
router.get('/levels/:id', authenticate, courseController.getLevel);
router.get('/modules/:id', authenticate, courseController.getModule);

module.exports = router;
