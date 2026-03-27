const videoProgressService = require('../services/videoProgressService');

const updateProgress = async (req, res, next) => {
  try {
    const { percentWatched } = req.body;

    if (percentWatched === undefined || percentWatched === null) {
      return res.status(400).json({ error: { message: 'percentWatched is required' } });
    }
    const pct = Number(percentWatched);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      return res.status(400).json({ error: { message: 'percentWatched must be between 0 and 100' } });
    }

    const result = await videoProgressService.updateVideoProgress(req.user.id, req.params.id, pct);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { updateProgress };
