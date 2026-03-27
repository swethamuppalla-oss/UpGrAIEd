const courseService = require('../services/courseService');

const listPrograms = async (req, res, next) => {
  try {
    const programs = await courseService.listPrograms();
    res.json({ programs });
  } catch (err) {
    next(err);
  }
};

const getLevelsByProgram = async (req, res, next) => {
  try {
    const result = await courseService.getLevelsByProgram(req.params.programId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getModulesByLevel = async (req, res, next) => {
  try {
    const result = await courseService.getModulesByLevel(req.params.levelId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getVideosByModule = async (req, res, next) => {
  try {
    const result = await courseService.getVideosByModule(req.params.moduleId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { listPrograms, getLevelsByProgram, getModulesByLevel, getVideosByModule };
