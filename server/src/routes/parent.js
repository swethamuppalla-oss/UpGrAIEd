const router = require('express').Router();
const parentController = require('../controllers/parentController');

router.get('/child', parentController.getChildInfo);
router.get('/activity', parentController.getChildActivity);
router.get('/billing', parentController.getParentBilling);

module.exports = router;
