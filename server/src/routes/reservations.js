const router = require('express').Router();
const { createReservation, checkReservation } = require('../controllers/reservationController');

router.post('/', createReservation);
router.get('/check/:phone', checkReservation);

module.exports = router;
