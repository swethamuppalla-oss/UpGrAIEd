const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Enrollment = require('../models/Enrollment');

// --- GET /admin/users ---

const listUsers = async ({ role, page = 1, limit = 20 } = {}) => {
  const filter = {};
  if (role) filter.role = role;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('name phone role isActive createdAt'),
    User.countDocuments(filter),
  ]);

  return { items, total, page, limit };
};

// --- GET /admin/payments ---

const listPayments = async ({ status, page = 1, limit = 20 } = {}) => {
  const filter = {};
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name phone')
      .populate('enrollment', 'status'),
    Transaction.countDocuments(filter),
  ]);

  return { items, total, page, limit };
};

// --- GET /admin/analytics ---

const getAnalytics = async () => {
  const [
    totalUsers,
    usersByRole,
    enrollmentsByStatus,
    revenueResult,
    recentTransactions,
  ] = await Promise.all([
    User.countDocuments(),

    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),

    Enrollment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    Transaction.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' }, totalTransactions: { $sum: 1 } } },
    ]),

    Transaction.find({ status: 'SUCCESS' })
      .sort({ verifiedAt: -1 })
      .limit(5)
      .select('amount currency verifiedAt')
      .populate('user', 'name phone'),
  ]);

  const revenue = revenueResult[0] || { totalRevenue: 0, totalTransactions: 0 };

  return {
    users: {
      total: totalUsers,
      byRole: Object.fromEntries(usersByRole.map(({ _id, count }) => [_id, count])),
    },
    enrollments: {
      byStatus: Object.fromEntries(enrollmentsByStatus.map(({ _id, count }) => [_id, count])),
    },
    revenue: {
      total: revenue.totalRevenue,
      successfulTransactions: revenue.totalTransactions,
    },
    recentTransactions,
  };
};

module.exports = { listUsers, listPayments, getAnalytics };
