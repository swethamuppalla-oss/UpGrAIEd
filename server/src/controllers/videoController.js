const fs = require('fs');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Video = require('../models/Video');
const VideoProgress = require('../models/VideoProgress');
const bunny = require('../services/bunnyService');

const getStudentEnrollment = async (userId) => {
  const student = await Student.findOne({ user: userId });
  if (!student) return null;
  return Enrollment.findOne({ student: student._id, status: 'ACTIVE' });
};

const uploadVideo = async (req, res, next) => {
  try {
    const { moduleId, title, description, order } = req.body;

    if (!moduleId || !title) {
      return res.status(400).json({ error: { message: 'moduleId and title are required' } });
    }
    if (!req.file) {
      return res.status(400).json({ error: { message: 'Video file is required' } });
    }

    const bunnyData = await bunny.uploadVideo(title, req.file.path);
    const bunnyVideoId = bunnyData.guid;

    const streamUrl = bunny.getStreamUrl(bunnyVideoId);
    const embedUrl = bunny.getEmbedUrl(bunnyVideoId);
    const thumbnailUrl = bunny.getThumbnailUrl(bunnyVideoId);

    const video = await Video.create({
      module: moduleId,
      title,
      description,
      bunnyVideoId,
      url: streamUrl,
      embedUrl,
      thumbnailUrl,
      order: order ? Number(order) : 0,
    });

    res.status(201).json({ video });
  } catch (err) {
    next(err);
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
  }
};

const listVideos = async (req, res, next) => {
  try {
    const { moduleId } = req.query;
    const filter = moduleId ? { module: moduleId } : {};
    const videos = await Video.find(filter).sort({ module: 1, order: 1 });
    res.json({ videos });
  } catch (err) {
    next(err);
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: { message: 'Video not found' } });
    }

    if (video.bunnyVideoId) {
      await bunny.deleteVideo(video.bunnyVideoId);
    }

    await video.deleteOne();
    res.json({ message: 'Video deleted' });
  } catch (err) {
    next(err);
  }
};

const getStreamUrl = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: { message: 'Video not found' } });
    }

    const embedUrl = video.embedUrl || (
      video.bunnyVideoId
        ? `https://iframe.mediadelivery.net/embed/${process.env.BUNNY_LIBRARY_ID}/${video.bunnyVideoId}`
        : null
    );

    res.json({
      embedUrl,
      streamUrl: embedUrl,
      videoId: video._id,
      title: video.title,
    });
  } catch (err) {
    next(err);
  }
};

const getVideoUrls = getStreamUrl;

const getMyProgress = async (req, res, next) => {
  try {
    const progress = await VideoProgress.findOne({
      user: req.user.id,
      video: req.params.id,
    });

    res.json({ percentWatched: progress?.percentWatched || 0 });
  } catch (err) {
    next(err);
  }
};

const postProgress = async (req, res, next) => {
  try {
    const percent = Number(req.body.percent || 0);
    const userId = req.user.id;
    const videoId = req.params.id;
    const safePercent = Math.max(0, Math.min(100, percent));

    let existing = await VideoProgress.findOne({ user: userId, video: videoId });
    let nextLevelUnlocked = false;

    if (!existing) {
      existing = await VideoProgress.create({
        user: userId,
        video: videoId,
        percentWatched: safePercent,
        completed: safePercent >= 85,
        completedAt: safePercent >= 85 ? new Date() : null,
      });
    } else if (safePercent > existing.percentWatched) {
      existing.percentWatched = safePercent;

      if (safePercent >= 85 && !existing.completed) {
        existing.completed = true;
        existing.completedAt = new Date();

        const video = await Video.findById(videoId).lean();
        if (video?.isMustDo) {
          const nextLevel = Number(video.level || 0) + 1;
          if (nextLevel > 1) {
            const enrollment = await getStudentEnrollment(userId);
            if (enrollment) {
              if (!enrollment.unlockedLevels?.includes(nextLevel)) {
                enrollment.unlockedLevels = [...new Set([...(enrollment.unlockedLevels || [1]), nextLevel])];
                await enrollment.save();
                nextLevelUnlocked = true;
              }
            }
          }
        }
      }

      await existing.save();
    } else if (safePercent >= 85 && !existing.completed) {
      existing.completed = true;
      existing.completedAt = new Date();
      await existing.save();
    }

    res.json({
      success: true,
      percentWatched: Math.max(safePercent, existing.percentWatched || 0),
      isComplete: safePercent >= 85 || existing.completed,
      nextLevelUnlocked,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadVideo,
  listVideos,
  deleteVideo,
  getVideoUrls,
  getStreamUrl,
  getMyProgress,
  postProgress,
};
