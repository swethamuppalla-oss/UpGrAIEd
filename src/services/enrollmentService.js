const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Parent = require('../models/Parent');

// --- Parent: reserve a seat ---

const reserveSeat = async (parentUserId, { studentId, notes }) => {
  const parent = await Parent.findOne({ user: parentUserId });
  if (!parent) {
    throw Object.assign(new Error('Parent profile not found'), { statusCode: 404 });
  }

  const student = await Student.findById(studentId);
  if (!student) {
    throw Object.assign(new Error('Student not found'), { statusCode: 404 });
  }

  // Confirm this student belongs to the requesting parent
  if (!student.parent.equals(parent._id)) {
    throw Object.assign(new Error('Student does not belong to this parent'), { statusCode: 403 });
  }

  // Prevent duplicate active reservations (the partial unique index handles DB-level,
  // but we surface a clean error here)
  const existing = await Enrollment.findOne({
    student: student._id,
    status: { $in: ['RESERVED', 'APPROVED', 'ACTIVE'] },
  });
  if (existing) {
    throw Object.assign(
      new Error(`Student already has an enrollment in status: ${existing.status}`),
      { statusCode: 409 }
    );
  }

  const enrollment = await Enrollment.create({
    student: student._id,
    parent: parent._id,
    notes,
  });

  return enrollment;
};

// --- Admin: list all reservations ---

const listReservations = async ({ status, page = 1, limit = 20 } = {}) => {
  const filter = {};
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Enrollment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('student', 'name grade')
      .populate('parent', 'name phone'),
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
  if (enrollment.status !== 'RESERVED') {
    throw Object.assign(
      new Error(`Cannot approve enrollment in status: ${enrollment.status}`),
      { statusCode: 409 }
    );
  }

  enrollment.status = 'APPROVED';
  enrollment.approvedBy = adminUserId;
  enrollment.approvedAt = new Date();
  enrollment.paymentEnabledAt = new Date(); // payment is now unlocked
  await enrollment.save();

  return enrollment;
};

// --- Called by payment service (Step 4) to activate ---

const activateEnrollment = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw Object.assign(new Error('Enrollment not found'), { statusCode: 404 });
  }
  if (enrollment.status !== 'APPROVED') {
    throw Object.assign(
      new Error(`Cannot activate enrollment in status: ${enrollment.status}`),
      { statusCode: 409 }
    );
  }

  enrollment.status = 'ACTIVE';
  enrollment.activatedAt = new Date();
  await enrollment.save();

  return enrollment;
};

module.exports = { reserveSeat, listReservations, approveReservation, activateEnrollment };
