const VideoProgress = require('../models/VideoProgress');
const Video = require('../models/Video');

const updateVideoProgress = async (userId, videoId, percentWatched) => {
  const video = await Video.findOne({ _id: videoId, isActive: true });
  if (!video) {
    throw Object.assign(new Error('Video not found'), { statusCode: 404 });
  }

  const isNowComplete = percentWatched >= VideoProgress.COMPLETION_THRESHOLD;

  // Always advance percentWatched, never regress it
  const existing = await VideoProgress.findOne({ user: userId, video: videoId });
  const safePercent = existing
    ? Math.max(existing.percentWatched, percentWatched)
    : percentWatched;

  const alreadyComplete = existing?.completed ?? false;

  const record = await VideoProgress.findOneAndUpdate(
    { user: userId, video: videoId },
    {
      percentWatched: safePercent,
      ...(isNowComplete && !alreadyComplete
        ? { completed: true, completedAt: new Date() }
        : {}),
    },
    { upsert: true, new: true }
  );

  return { videoProgress: record, justCompleted: isNowComplete && !alreadyComplete };
};

module.exports = { updateVideoProgress };
