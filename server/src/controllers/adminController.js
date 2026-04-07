const Enrollment = require('../models/Enrollment');
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const VideoProgress = require('../models/VideoProgress');

const formatDate = (value) => {
  if (!value) return '';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

const getStats = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalUsers, pendingReservations, revenueResult, activeToday] = await Promise.all([
      Enrollment.countDocuments({ status: 'ACTIVE' }),
      Enrollment.countDocuments({ status: 'RESERVED' }),
      Transaction.aggregate([
        { $match: { status: 'SUCCESS' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      VideoProgress.distinct('user', { updatedAt: { $gte: todayStart } }).then((items) => items.length),
    ]);

    res.json({
      totalUsers,
      pendingReservations,
      totalRevenue: revenueResult[0]?.total || 0,
      activeToday,
    });
  } catch (err) {
    next(err);
  }
};

const listReservations = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({})
      .sort({ createdAt: -1 })
      .populate('parent', 'name phone email')
      .populate('student', 'name grade')
      .lean();

    res.json(
      enrollments.map((item) => ({
        _id: item._id,
        parentName: item.parent?.name || 'Unknown parent',
        phone: item.parent?.phone || 'N/A',
        email: item.parent?.email || 'N/A',
        grade: item.student?.grade || 'Grade pending',
        childName: item.student?.name || 'Unknown child',
        status:
          item.status === 'RESERVED'
            ? 'reserved'
            : item.status === 'APPROVED'
              ? 'approved'
              : 'payment-sent',
        createdAt: item.createdAt,
      }))
    );
  } catch (err) {
    next(err);
  }
};

const approveReservation = async (req, res, next) => {
  try {
    const reservation = await Enrollment.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: { message: 'Reservation not found' } });
    }

    if (reservation.status === 'RESERVED') {
      reservation.status = 'APPROVED';
      reservation.approvedBy = req.user.id;
      reservation.approvedAt = new Date();
      reservation.paymentEnabledAt = new Date();
      await reservation.save();
    }

    res.json({
      _id: reservation._id,
      status: reservation.status === 'RESERVED' ? 'reserved' : 'approved',
    });
  } catch (err) {
    next(err);
  }
};

const listPayments = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ status: 'SUCCESS' })
      .sort({ createdAt: -1 })
      .populate({
        path: 'enrollment',
        populate: { path: 'student', select: 'name grade' },
      })
      .lean();

    res.json(
      transactions.map((item) => ({
        _id: item._id,
        studentName: item.enrollment?.student?.name || 'Unknown student',
        grade: item.enrollment?.student?.grade || 'Grade pending',
        amount: item.amount,
        date: item.verifiedAt || item.createdAt,
        status: 'paid',
      }))
    );
  } catch (err) {
    next(err);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $in: ['student', 'parent'] } })
      .sort({ createdAt: -1 })
      .lean();

    const [students, parents] = await Promise.all([
      Student.find({ user: { $in: users.filter((item) => item.role === 'student').map((item) => item._id) } })
        .select('user grade')
        .lean(),
      Parent.find({ user: { $in: users.filter((item) => item.role === 'parent').map((item) => item._id) } })
        .select('user')
        .lean(),
    ]);

    const studentGradeMap = new Map(students.map((item) => [String(item.user), item.grade || 'Grade pending']));
    const parentIdSet = new Set(parents.map((item) => String(item.user)));

    res.json(
      users.map((item) => ({
        _id: item._id,
        name: item.name || 'Unknown user',
        email: item.email,
        role: item.role,
        grade: item.role === 'student' ? studentGradeMap.get(String(item._id)) || 'Grade pending' : 'N/A',
        status: item.isBlocked ? 'blocked' : 'active',
        isBlocked: Boolean(item.isBlocked),
        enrolledAt: item.createdAt,
        createdAt: formatDate(item.createdAt),
        hasProfile: item.role === 'parent' ? parentIdSet.has(String(item._id)) : true,
      }))
    );
  } catch (err) {
    next(err);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true, isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({ _id: user._id, isBlocked: true });
  } catch (err) {
    next(err);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false, isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({ _id: user._id, isBlocked: false });
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
};
