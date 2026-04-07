const Parent     = require('../models/Parent');
const Enrollment = require('../models/Enrollment');
const Student    = require('../models/Student');
const VideoProgress = require('../models/VideoProgress');
const Level      = require('../models/Level');
const Progress   = require('../models/Progress');

// ── GET /api/parent/dashboard ─────────────────────────────────────────────────
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const parent = await Parent.findOne({ user: userId });
    if (!parent) return res.json({ hasProfile: false });

    // Find enrollment where this parent is linked
    const enrollment = await Enrollment.findOne({ parent: parent._id })
      .sort({ createdAt: -1 })
      .populate({
        path:   'student',
        select: 'name',
        populate: { path: 'user', select: 'name email' },
      });

    if (!enrollment) {
      return res.json({ hasProfile: true, enrollment: null });
    }

    // Basic enrollment info
    const result = {
      hasProfile: true,
      enrollment: {
        id:          enrollment._id,
        status:      enrollment.status,
        createdAt:   enrollment.createdAt,
        approvedAt:  enrollment.approvedAt,
        activatedAt: enrollment.activatedAt,
        notes:       enrollment.notes,
      },
      child: {
        name:  enrollment.student?.user?.name || enrollment.student?.name || 'Your Child',
        email: enrollment.student?.user?.email || '',
      },
    };

    // If active, attach child's learning stats
    if (enrollment.status === 'ACTIVE') {
      const studentUserId = enrollment.student?.user?._id || enrollment.student?.user;

      const modulesCompleted = await Progress.countDocuments({
        user: studentUserId, completed: true,
      });

      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const modulesThisWeek = await Progress.countDocuments({
        user: studentUserId,
        completed: true,
        completedAt: { $gte: oneWeekAgo },
      });

      // Day streak
      const completions = await Progress.find({
        user: studentUserId,
        completed: true,
        completedAt: { $ne: null },
      }).select('completedAt');

      const daySet = new Set(
        completions.map((c) => {
          const d = new Date(c.completedAt);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      );
      let dayStreak  = 0;
      const checkDay = new Date();
      checkDay.setHours(0, 0, 0, 0);
      while (daySet.has(checkDay.getTime())) {
        dayStreak++;
        checkDay.setDate(checkDay.getDate() - 1);
      }

      // Current level from latest video progress
      let currentLevel = 1;
      const latestVP = await VideoProgress.findOne({ user: studentUserId })
        .sort({ updatedAt: -1 })
        .populate({ path: 'video', populate: { path: 'module', select: 'level' } });

      if (latestVP?.video?.module?.level) {
        const level = await Level.findById(latestVP.video.module.level).select('program order');
        if (level) {
          currentLevel = await Level.countDocuments({
            program: level.program,
            order: { $lte: level.order },
            isActive: true,
          });
        }
      }

      result.childStats = {
        currentLevel,
        totalLevels: 11,
        modulesCompleted,
        modulesThisWeek,
        dayStreak,
      };
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
