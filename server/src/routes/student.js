const router = require('express').Router();
const { getProgress, getStats, getLevels } = require('../controllers/studentController');

router.get('/progress', getProgress);
router.get('/stats',    getStats);
router.get('/levels',   getLevels);

module.exports = router;
