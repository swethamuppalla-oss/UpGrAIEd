const progressionService = require('../services/progressionService');

const completeModule = async (req, res, next) => {
  try {
    const { moduleId } = req.body;
    if (!moduleId) {
      return res.status(400).json({ error: { message: 'moduleId is required' } });
    }

    const result = await progressionService.completeModule(req.user.id, moduleId);

    const response = { progress: result.progress };
    if (result.unlockedLevel) {
      response.unlockedLevel = {
        levelId: result.unlockedLevel.levelId,
        title: result.unlockedLevel.title,
      };
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = { completeModule };
