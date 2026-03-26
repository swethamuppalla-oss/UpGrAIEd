const courseService = require('../services/courseService');

const listPrograms = async (req, res, next) => {
  try {
    const programs = await courseService.listPrograms();
    res.json({ programs });
  } catch (err) {
    next(err);
  }
};

const getLevel = async (req, res, next) => {
  try {
    const result = await courseService.getLevel(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getModule = async (req, res, next) => {
  try {
    const result = await courseService.getModule(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { listPrograms, getLevel, getModule };
