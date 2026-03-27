const VideoProgress = require('../models/VideoProgress');
const Video = require('../models/Video');

const updateVideoProgress = async (userId, videoId, percentWatched) => {
  const video = await Video.findById(videoId);
  if (!video) {
    throw Object.assign(new Error('Video not found'), { statusCode: 404 });
  }

  const existing = await VideoProgress.findOne({ userId, videoId });

  // Never regress — keep the highest percent seen
  const safePercent = existing
    ? Math.max(existing.percentWatched, percentWatched)
    : percentWatched;

  const alreadyComplete = existing?.completed ?? false;
  const isNowComplete = safePercent >= VideoProgress.COMPLETION_THRESHOLD;

  const record = await VideoProgress.findOneAndUpdate(
    { userId, videoId },
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
