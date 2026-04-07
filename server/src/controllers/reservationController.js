const Reservation = require('../models/Reservation');

const normalizePhone = (value = '') =>
  value.replace(/\s|-/g, '').replace(/^\+91/, '').trim();

const createReservation = async (req, res) => {
  try {
    const {
      parentName, childName, grade,
      phone, email, city, source,
    } = req.body;

    if (!parentName || !childName || !grade || !phone || !email || !city) {
      return res.status(400).json({
        error: { message: 'All required fields must be filled' },
      });
    }

    const normalizedPhone = normalizePhone(phone);
    const existing = await Reservation.findOne({ phone: normalizedPhone });
    if (existing) {
      return res.status(400).json({
        error: {
          message: 'A reservation with this phone number already exists',
        },
      });
    }

    const reservation = await Reservation.create({
      parentName,
      childName,
      grade,
      phone: normalizedPhone,
      email,
      city,
      source,
      status: 'reserved',
    });

    res.status(201).json({
      success: true,
      reservationId: reservation._id,
      message: 'Reservation created successfully',
    });
  } catch (err) {
    console.error('Reservation error:', err);
    res.status(500).json({
      error: { message: 'Failed to create reservation' },
    });
  }
};

const checkReservation = async (req, res) => {
  const existing = await Reservation.findOne({
    phone: normalizePhone(req.params.phone),
  });
  res.json({ exists: !!existing });
};

module.exports = {
  createReservation,
  checkReservation,
};
