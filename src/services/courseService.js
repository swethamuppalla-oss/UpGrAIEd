const Program = require('../models/Program');
const Level = require('../models/Level');
const Module = require('../models/Module');
const Video = require('../models/Video');

const listPrograms = () =>
  Program.find().sort({ createdAt: 1 });

const getLevelsByProgram = async (programId) => {
  const program = await Program.findById(programId);
  if (!program) {
    throw Object.assign(new Error('Program not found'), { statusCode: 404 });
  }

  const levels = await Level.find({ programId }).sort({ levelNumber: 1 });
  return { program, levels };
};

const getModulesByLevel = async (levelId) => {
  const level = await Level.findById(levelId).populate('programId', 'name');
  if (!level) {
    throw Object.assign(new Error('Level not found'), { statusCode: 404 });
  }

  const modules = await Module.find({ levelId });
  return { level, modules };
};

const getVideosByModule = async (moduleId) => {
  const mod = await Module.findById(moduleId).populate({
    path: 'levelId',
    select: 'title levelNumber',
    populate: { path: 'programId', select: 'name' },
  });
  if (!mod) {
    throw Object.assign(new Error('Module not found'), { statusCode: 404 });
  }

  const videos = await Video.find({ moduleId });
  return { module: mod, videos };
};

module.exports = { listPrograms, getLevelsByProgram, getModulesByLevel, getVideosByModule };
