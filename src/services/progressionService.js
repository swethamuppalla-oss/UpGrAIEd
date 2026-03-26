const Progress = require('../models/Progress');
const LevelUnlock = require('../models/LevelUnlock');
const Module = require('../models/Module');
const Level = require('../models/Level');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');

// Verify the user has an ACTIVE enrollment before any progression action
const assertActiveEnrollment = async (userId) => {
  const student = await Student.findOne({ user: userId });
  if (!student) {
    throw Object.assign(new Error('Student profile not found'), { statusCode: 403 });
  }
  const enrollment = await Enrollment.findOne({ student: student._id, status: 'ACTIVE' });
  if (!enrollment) {
    throw Object.assign(new Error('No active enrollment'), { statusCode: 403 });
  }
};

// Mark a module complete and, if it was the MUST DO, attempt to unlock the next level
const completeModule = async (userId, moduleId) => {
  await assertActiveEnrollment(userId);

  const mod = await Module.findOne({ _id: moduleId, isActive: true });
  if (!mod) {
    throw Object.assign(new Error('Module not found'), { statusCode: 404 });
  }

  // Upsert progress record
  const progress = await Progress.findOneAndUpdate(
    { user: userId, module: moduleId },
    { completed: true, completedAt: new Date() },
    { upsert: true, new: true }
  );

  let unlockedLevel = null;

  if (mod.isMustDo) {
    unlockedLevel = await tryUnlockNextLevel(userId, mod.level);
  }

  return { progress, unlockedLevel };
};

// Internal: unlock the next level in the same program if not already unlocked
const tryUnlockNextLevel = async (userId, currentLevelId) => {
  const currentLevel = await Level.findById(currentLevelId);
  if (!currentLevel) return null;

  const nextLevel = await Level.findOne({
    program: currentLevel.program,
    order: { $gt: currentLevel.order },
    isActive: true,
  }).sort({ order: 1 });

  if (!nextLevel) return null; // already at the last level

  // Idempotent — ignore duplicate key if already unlocked
  const unlock = await LevelUnlock.findOneAndUpdate(
    { user: userId, level: nextLevel._id },
    { unlockedAt: new Date() },
    { upsert: true, new: true }
  );

  return { level: nextLevel, unlock };
};

// Check whether a user can access a given level
const isLevelUnlocked = async (userId, levelId) => {
  const level = await Level.findById(levelId);
  if (!level) return false;

  // The first level of every program is always accessible to active students
  const firstLevel = await Level.findOne({ program: level.program, isActive: true })
    .sort({ order: 1 });

  if (firstLevel && firstLevel._id.equals(level._id)) return true;

  const unlock = await LevelUnlock.findOne({ user: userId, level: levelId });
  return !!unlock;
};

module.exports = { completeModule, isLevelUnlocked };
