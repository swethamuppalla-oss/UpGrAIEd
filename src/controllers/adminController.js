const adminService = require('../services/adminService');

const listUsers = async (req, res, next) => {
  try {
    const { role, page, limit } = req.query;
    const result = await adminService.listUsers({
      role,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const listPayments = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const result = await adminService.listPayments({
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await adminService.getAnalytics();
    res.json(analytics);
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, listPayments, getAnalytics };
