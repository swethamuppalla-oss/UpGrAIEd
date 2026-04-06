const Program = require('../models/Program');
const Level = require('../models/Level');
const Module = require('../models/Module');
const Video = require('../models/Video');

const listPrograms = () =>
  Program.find({ isActive: true }).sort({ order: 1 });

const getLevel = async (levelId) => {
  const level = await Level.findOne({ _id: levelId, isActive: true })
    .populate('program', 'title');
  if (!level) {
    throw Object.assign(new Error('Level not found'), { statusCode: 404 });
  }

  const modules = await Module.find({ level: levelId, isActive: true })
    .sort({ order: 1 })
    .select('title description order');

  return { level, modules };
};

const getModule = async (moduleId) => {
  const mod = await Module.findOne({ _id: moduleId, isActive: true })
    .populate({ path: 'level', select: 'title', populate: { path: 'program', select: 'title' } });
  if (!mod) {
    throw Object.assign(new Error('Module not found'), { statusCode: 404 });
  }

  const videos = await Video.find({ module: moduleId, isActive: true })
    .sort({ order: 1 })
    .select('title description url durationSeconds order');

  return { module: mod, videos };
};

module.exports = { listPrograms, getLevel, getModule };
