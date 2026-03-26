const Enrollment = require('../models/Enrollment');

// --- Parent: reserve a seat ---

const reserveSeat = async (parentId, { studentName, grade }) => {
  // Prevent duplicate active reservations for the same parent + student
  const existing = await Enrollment.findOne({
    parentId,
    studentName,
    status: { $in: ['reserved', 'approved', 'active'] },
  });
  if (existing) {
    throw Object.assign(
      new Error(`An enrollment for ${studentName} already exists with status: ${existing.status}`),
      { statusCode: 409 }
    );
  }

  const enrollment = await Enrollment.create({ parentId, studentName, grade });
  return enrollment;
};

// --- Parent: get own reservations ---

const getMyReservations = async (parentId) => {
  const enrollments = await Enrollment.find({ parentId })
    .sort({ createdAt: -1 });
  return enrollments;
};

// --- Admin: list reservations ---

const listReservations = async ({ status, page = 1, limit = 20 } = {}) => {
  const filter = {};
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Enrollment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('parentId', 'name email'),
    Enrollment.countDocuments(filter),
  ]);

  return { items, total, page, limit };
};

// --- Admin: approve a reservation ---

const approveReservation = async (enrollmentId, adminUserId) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw Object.assign(new Error('Enrollment not found'), { statusCode: 404 });
  }
  if (enrollment.status !== 'reserved') {
    throw Object.assign(
      new Error(`Cannot approve enrollment in status: ${enrollment.status}`),
      { statusCode: 409 }
    );
  }

  enrollment.status = 'approved';
  enrollment.approvedBy = adminUserId;
  enrollment.approvedAt = new Date();
  await enrollment.save();

  return enrollment;
};

// --- Called by payment service to activate ---

const activateEnrollment = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw Object.assign(new Error('Enrollment not found'), { statusCode: 404 });
  }
  if (enrollment.status !== 'approved') {
    throw Object.assign(
      new Error(`Cannot activate enrollment in status: ${enrollment.status}`),
      { statusCode: 409 }
    );
  }

  enrollment.status = 'active';
  enrollment.paymentStatus = 'paid';
  enrollment.activatedAt = new Date();
  await enrollment.save();

  return enrollment;
};

module.exports = { reserveSeat, getMyReservations, listReservations, approveReservation, activateEnrollment };
