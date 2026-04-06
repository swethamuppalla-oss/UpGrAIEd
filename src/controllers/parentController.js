const Parent = require('../models/Parent');
const Student = require('../models/Student');
const VideoProgress = require('../models/VideoProgress');
const Transaction = require('../models/Transaction');
const Enrollment = require('../models/Enrollment');
const Video = require('../models/Video');
const Module = require('../models/Module');
const Level = require('../models/Level');

/**
 * GET /api/parent/child
 * Returns child info linked to the authenticated parent
 */
const getChild = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({ user: req.user.id });
    if (!parent) {
      return res.status(404).json({ error: { message: 'Parent profile not found' } });
    }

    const student = await Student.findOne({ parent: parent._id });
    if (!student) {
      return res.status(404).json({ error: { message: 'No child linked to this account' } });
    }

    // Find active enrollment to get programme/level info
    const enrollment = await Enrollment.findOne({
      student: student._id,
      status: { $in: ['ACTIVE', 'APPROVED', 'RESERVED'] },
    }).sort({ createdAt: -1 });

    // Count completed video progress entries for stats
    const completedVideos = await VideoProgress.countDocuments({
      user: student.user,
      completed: true,
    });

    // Rough overall progress as % of 66 total modules
    const TOTAL_MODULES = 66;
    const overallProgress = Math.min(100, Math.round((completedVideos / TOTAL_MODULES) * 100));

    res.json({
      name: student.name,
      grade: student.grade || 'Grade 8',
      programme: 'Junior',
      currentLevel: 1,
      progress: overallProgress,
      modulesCompleted: completedVideos,
      streak: 0,
      totalHours: 0,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/parent/activity
 * Returns last 10 VideoProgress entries for the child, with module/level info
 */
const getActivity = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({ user: req.user.id });
    if (!parent) {
      return res.status(404).json({ error: { message: 'Parent profile not found' } });
    }

    const student = await Student.findOne({ parent: parent._id });
    if (!student) {
      return res.status(404).json({ error: { message: 'No child linked to this account' } });
    }

    const progressRecords = await VideoProgress.find({ user: student.user })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate({
        path: 'video',
        select: 'title module',
        populate: {
          path: 'module',
          select: 'title level',
          populate: { path: 'level', select: 'title order' },
        },
      });

    const activity = progressRecords.map((p) => {
      const video = p.video;
      const mod = video?.module;
      const level = mod?.level;
      const ageMs = Date.now() - new Date(p.updatedAt).getTime();
      const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
      let dateLabel;
      if (ageDays === 0) dateLabel = 'Today';
      else if (ageDays === 1) dateLabel = 'Yesterday';
      else if (ageDays < 7) dateLabel = `${ageDays} days ago`;
      else dateLabel = `${Math.floor(ageDays / 7)} week${ageDays >= 14 ? 's' : ''} ago`;

      return {
        module: video?.title || 'Unknown Module',
        level: level ? `Level ${level.order}` : 'Unknown Level',
        status: p.completed ? 'completed' : 'in-progress',
        date: dateLabel,
      };
    });

    res.json(activity);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/parent/billing
 * Returns the most recent Transaction for this parent
 */
const getBilling = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({ user: req.user.id });
    if (!parent) {
      return res.status(404).json({ error: { message: 'Parent profile not found' } });
    }

    const transaction = await Transaction.findOne({
      user: req.user.id,
      status: 'SUCCESS',
    })
      .sort({ createdAt: -1 })
      .populate('enrollment', 'status');

    if (!transaction) {
      return res.json({ status: 'unpaid' });
    }

    const dateStr = new Date(transaction.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    res.json({
      amount: transaction.amount,
      date: dateStr,
      status: 'paid',
      invoiceId: transaction._id.toString().slice(-8).toUpperCase(),
      grade: 'Grade 8',
      programme: 'Junior',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/parent/payment-status
 * Used by PaymentPage to check reservation/payment status
 */
const getPaymentStatus = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({ user: req.user.id });
    if (!parent) {
      return res.status(404).json({ error: { message: 'Parent profile not found' } });
    }

    const student = await Student.findOne({ parent: parent._id });
    const enrollment = student
      ? await Enrollment.findOne({ student: student._id }).sort({ createdAt: -1 })
      : null;

    if (!enrollment) {
      return res.json({ status: 'no_reservation' });
    }

    const statusMap = {
      RESERVED: 'reserved',
      APPROVED: 'approved',
      ACTIVE: 'paid',
      REJECTED: 'rejected',
    };

    res.json({
      status: statusMap[enrollment.status] || 'reserved',
      grade: student?.grade || 'Grade 8',
      programme: 'Junior',
      price: 6999,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getChild, getActivity, getBilling, getPaymentStatus };
