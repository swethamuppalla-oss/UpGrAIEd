const enrollmentService = require('../services/enrollmentService');

const reserve = async (req, res, next) => {
  try {
    const { studentId, notes } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: { message: 'studentId is required' } });
    }

    const enrollment = await enrollmentService.reserveSeat(req.user.id, { studentId, notes });
    res.status(201).json({ enrollment });
  } catch (err) {
    next(err);
  }
};

const approve = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    const enrollment = await enrollmentService.approveReservation(enrollmentId, req.user.id);
    res.json({ enrollment });
  } catch (err) {
    next(err);
  }
};

const listReservations = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const result = await enrollmentService.listReservations({
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { reserve, approve, listReservations };
