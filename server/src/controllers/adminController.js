const User          = require('../models/User');
const Transaction   = require('../models/Transaction');
const Enrollment    = require('../models/Enrollment');
const VideoProgress = require('../models/VideoProgress');
const Student       = require('../models/Student');

// ── helpers ────────────────────────────────────────────────────────────────────
const normaliseStatus = (s) => {
  if (!s) return 'reserved';
  const map = { RESERVED: 'reserved', APPROVED: 'approved', ACTIVE: 'paid', REJECTED: 'rejected' };
  return map[s] || s.toLowerCase();
};

const fmtDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ── GET /api/admin/stats ───────────────────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      totalEnrolled,
      pendingReservations,
      revenueResult,
      activeToday,
      enrolledThisWeek,
      monthRevenueResult,
    ] = await Promise.all([
      Enrollment.countDocuments({ status: 'ACTIVE' }),
      Enrollment.countDocuments({ status: 'RESERVED' }),
      Transaction.aggregate([
        { $match: { status: 'SUCCESS' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      VideoProgress.distinct('user', { updatedAt: { $gte: todayStart } }).then((u) => u.length),
      Enrollment.countDocuments({ status: 'ACTIVE', activatedAt: { $gte: weekStart } }),
      Transaction.aggregate([
        { $match: { status: 'SUCCESS', createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    res.json({
      totalEnrolled,
      pendingReservations,
      totalRevenue:      revenueResult[0]?.total      || 0,
      activeToday,
      enrolledThisWeek,
      revenueThisMonth:  monthRevenueResult[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/reservations ────────────────────────────────────────────────
const listReservations = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      status: { $in: ['RESERVED', 'APPROVED', 'ACTIVE'] },
    })
      .sort({ createdAt: -1 })
      .populate('student', 'name grade')
      .populate('parent', 'name phone')
      .lean();

    const items = enrollments.map((e) => ({
      _id:        e._id,
      parentName: e.parent?.name  || 'Unknown',
      childName:  e.student?.name || 'Unknown',
      grade:      e.student?.grade ? `Grade ${e.student.grade}` : '—',
      phone:      e.parent?.phone || '—',
      createdAt:  fmtDate(e.createdAt),
      status:     normaliseStatus(e.status),
    }));

    res.json(items);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/admin/approve/:id ────────────────────────────────────────────────
const approveReservation = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status: 'APPROVED', approvedBy: req.user.id, approvedAt: new Date(), paymentEnabledAt: new Date() },
      { new: true }
    );
    if (!enrollment) {
      return res.status(404).json({ error: { message: 'Reservation not found' } });
    }
    res.json({ success: true, reservation: { _id: enrollment._id, status: 'approved' } });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/payments ────────────────────────────────────────────────────
const listPayments = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ status: 'SUCCESS' })
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .populate({
        path:     'enrollment',
        populate: { path: 'student', select: 'name grade' },
      })
      .lean();

    const items = transactions.map((t) => ({
      _id:         t._id,
      parentName:  t.user?.name                   || 'Unknown',
      studentName: t.enrollment?.student?.name    || 'Unknown',
      grade:       t.enrollment?.student?.grade
        ? `Grade ${t.enrollment.student.grade}`
        : '—',
      amount: t.amount,
      date:   fmtDate(t.createdAt),
    }));

    res.json(items);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/users ───────────────────────────────────────────────────────
const listUsers = async (req, res, next) => {
  try {
    const { role, page, limit } = req.query;
    const filter = { role: { $in: ['student', 'parent', 'creator'] } };
    if (role && role !== 'all') filter.role = role;

    const skip    = ((page ? Number(page) : 1) - 1) * (limit ? Number(limit) : 50);
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -activeSessionToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit ? Number(limit) : 50)
        .lean(),
      User.countDocuments(filter),
    ]);

    // Attach grade for students
    const studentUsers = users.filter((u) => u.role === 'student');
    const studentDocs  = await Student.find({
      user: { $in: studentUsers.map((u) => u._id) },
    }).select('user grade').lean();
    const gradeMap = {};
    studentDocs.forEach((s) => { gradeMap[s.user.toString()] = s.grade; });

    const items = users.map((u) => ({
      _id:       u._id,
      name:      u.name || 'Unknown',
      email:     u.email,
      role:      u.role,
      grade:     u.role === 'student' ? (gradeMap[u._id.toString()] ? `Grade ${gradeMap[u._id.toString()]}` : '—') : '—',
      isBlocked: !u.isActive,
      createdAt: fmtDate(u.createdAt),
    }));

    res.json({ items, total });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/admin/users/:id/block ───────────────────────────────────────────
const blockUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/admin/users/:id/unblock ─────────────────────────────────────────
const unblockUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: true });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/analytics (keep for backward compat) ───────────────────────
const getAnalytics = async (req, res, next) => {
  try {
    const [usersByRole, enrollmentsByStatus, revenueResult] = await Promise.all([
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Enrollment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Transaction.aggregate([
        { $match: { status: 'SUCCESS' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
    ]);
    const totalUsers = usersByRole.reduce((s, r) => s + r.count, 0);
    res.json({
      users:       { total: totalUsers, byRole: Object.fromEntries(usersByRole.map(({ _id, count }) => [_id, count])) },
      enrollments: { byStatus: Object.fromEntries(enrollmentsByStatus.map(({ _id, count }) => [_id, count])) },
      revenue:     { total: revenueResult[0]?.total || 0, successfulTransactions: revenueResult[0]?.count || 0 },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  listReservations,
  approveReservation,
  listPayments,
  listUsers,
  blockUser,
  unblockUser,
  getAnalytics,
};
