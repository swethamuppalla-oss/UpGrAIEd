const Student      = require('../models/Student');
const Enrollment   = require('../models/Enrollment');
const Level        = require('../models/Level');
const Module       = require('../models/Module');
const Video        = require('../models/Video');
const VideoProgress = require('../models/VideoProgress');
const Progress     = require('../models/Progress');
const LevelUnlock  = require('../models/LevelUnlock');

// ── GET /api/student/progress ─────────────────────────────────────────────────
const getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const student = await Student.findOne({ user: userId });
    if (!student) return res.json({ enrolled: false });

    const enrollment = await Enrollment.findOne({ student: student._id, status: 'ACTIVE' });
    if (!enrollment) return res.json({ enrolled: false });

    // Find the most recently touched video → derive current module & level
    const latestVP = await VideoProgress.findOne({ user: userId })
      .sort({ updatedAt: -1 })
      .populate({
        path: 'video',
        select: 'module durationSeconds',
        populate: { path: 'module', select: 'title level order' },
      });

    let currentModule = null;
    let currentLevel  = null;
    let currentProgress = 0;

    if (latestVP?.video?.module) {
      currentModule   = latestVP.video.module;
      currentLevel    = await Level.findById(currentModule.level).select('title program order');
      currentProgress = latestVP.percentWatched;
    } else {
      // New student — find first level + first module
      currentLevel  = await Level.findOne({ isActive: true }).sort({ order: 1 });
      if (currentLevel) {
        currentModule = await Module.findOne({ level: currentLevel._id, isActive: true }).sort({ order: 1 });
      }
    }

    // Ordinal position of the level and module
    let levelNumber  = 1;
    let moduleNumber = 1;

    if (currentLevel) {
      levelNumber = await Level.countDocuments({
        program: currentLevel.program,
        order: { $lte: currentLevel.order },
        isActive: true,
      });
    }
    if (currentModule) {
      moduleNumber = await Module.countDocuments({
        level: currentModule.level,
        order: { $lte: currentModule.order },
        isActive: true,
      });
    }

    res.json({
      enrolled: true,
      currentLevel:        levelNumber,
      currentLevelTitle:   currentLevel?.title  || '',
      currentModuleId:     currentModule?._id   || null,
      currentModuleName:   currentModule?.title || '',
      currentModuleProgress: Math.round(currentProgress),
      moduleNumber,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/student/stats ────────────────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const modulesCompleted = await Progress.countDocuments({ user: userId, completed: true });

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const modulesThisWeek = await Progress.countDocuments({
      user: userId,
      completed: true,
      completedAt: { $gte: oneWeekAgo },
    });

    // Total watch time from video durations × percent watched
    const vps = await VideoProgress.find({ user: userId })
      .populate('video', 'durationSeconds');
    const totalSeconds = vps.reduce((sum, vp) => {
      const secs = vp.video?.durationSeconds || 0;
      return sum + (vp.percentWatched / 100) * secs;
    }, 0);
    const totalHours = Math.round((totalSeconds / 3600) * 10) / 10;

    // Day streak: count consecutive days (today backwards) with any completed module
    const completions = await Progress.find({
      user: userId,
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

    // Current level ordinal
    let currentLevel = 1;
    const student = await Student.findOne({ user: userId });
    if (student) {
      const enroll = await Enrollment.findOne({ student: student._id, status: 'ACTIVE' });
      if (enroll) {
        const lv = await VideoProgress.findOne({ user: userId })
          .sort({ updatedAt: -1 })
          .populate({ path: 'video', populate: { path: 'module', select: 'level' } });

        if (lv?.video?.module?.level) {
          const level = await Level.findById(lv.video.module.level).select('program order');
          if (level) {
            currentLevel = await Level.countDocuments({
              program: level.program,
              order: { $lte: level.order },
              isActive: true,
            });
          }
        }
      }
    }

    res.json({ currentLevel, totalLevels: 11, modulesCompleted, modulesThisWeek, dayStreak, totalHours });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/student/levels ───────────────────────────────────────────────────
const getLevels = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const levels  = await Level.find({ isActive: true }).sort({ order: 1 });
    const unlocks = await LevelUnlock.find({ user: userId }).select('level');
    const unlockedSet = new Set(unlocks.map((u) => u.level.toString()));

    // Determine the active level from the most recent video progress
    const latestVP = await VideoProgress.findOne({ user: userId })
      .sort({ updatedAt: -1 })
      .populate({ path: 'video', populate: { path: 'module', select: 'level' } });

    const activeLevelId = latestVP?.video?.module?.level?.toString() || null;
    const firstLevelId  = levels[0]?._id.toString() || null;

    let passedActive = false;
    const result = levels.map((level, idx) => {
      const id      = level._id.toString();
      const isFirst = id === firstLevelId;

      let status;
      if (id === activeLevelId) {
        status      = 'active';
        passedActive = true;
      } else if (!passedActive && (isFirst || unlockedSet.has(id))) {
        status = 'completed';
      } else {
        status = 'locked';
      }

      return { id, level: idx + 1, title: level.title, status };
    });

    // New student with no video progress — first level is active
    if (!passedActive && result.length > 0) {
      const first = result.find((l) => l.status !== 'locked');
      if (first) first.status = 'active';
    }

    res.json({ levels: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProgress, getStats, getLevels };
