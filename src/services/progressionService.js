const Progress = require('../models/Progress');
const LevelUnlock = require('../models/LevelUnlock');
const Module = require('../models/Module');
const Level = require('../models/Level');
const Enrollment = require('../models/Enrollment');

// Verify the user has an active enrollment before any progression action
const assertActiveEnrollment = async (userId) => {
  const enrollment = await Enrollment.findOne({ parentId: userId, status: 'active' });
  if (!enrollment) {
    throw Object.assign(new Error('No active enrollment'), { statusCode: 403 });
  }
};

// Mark a module complete; if it is the MUST DO, unlock the next level
const completeModule = async (userId, moduleId) => {
  await assertActiveEnrollment(userId);

  const mod = await Module.findById(moduleId);
  if (!mod) {
    throw Object.assign(new Error('Module not found'), { statusCode: 404 });
  }

  // Upsert — calling complete twice is safe
  const progress = await Progress.findOneAndUpdate(
    { userId, moduleId },
    { completed: true, completedAt: new Date() },
    { upsert: true, new: true }
  );

  let unlockedLevel = null;

  if (mod.isMustDo) {
    unlockedLevel = await tryUnlockNextLevel(userId, mod.levelId);
  }

  return { progress, unlockedLevel };
};

// Find the next level in the same program and unlock it for this user
const tryUnlockNextLevel = async (userId, currentLevelId) => {
  const currentLevel = await Level.findById(currentLevelId);
  if (!currentLevel) return null;

  const nextLevel = await Level.findOne({
    programId: currentLevel.programId,
    levelNumber: { $gt: currentLevel.levelNumber },
  }).sort({ levelNumber: 1 });

  if (!nextLevel) return null; // already at the last level

  // Idempotent — upsert so calling twice doesn't throw
  const unlock = await LevelUnlock.findOneAndUpdate(
    { userId, levelId: nextLevel._id },
    { unlockedAt: new Date() },
    { upsert: true, new: true }
  );

  return { levelId: nextLevel._id, title: nextLevel.title, unlock };
};

// Check whether a user can access a given level
const isLevelUnlocked = async (userId, levelId) => {
  const level = await Level.findById(levelId);
  if (!level) return false;

  // Level 1 of every program is always accessible
  const firstLevel = await Level.findOne({ programId: level.programId }).sort({ levelNumber: 1 });
  if (firstLevel && firstLevel._id.equals(level._id)) return true;

  const unlock = await LevelUnlock.findOne({ userId, levelId });
  return !!unlock;
};

module.exports = { completeModule, isLevelUnlocked };
