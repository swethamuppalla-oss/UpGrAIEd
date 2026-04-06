const fs = require('fs');
const Video = require('../models/Video');
const bunny = require('../services/bunnyService');

/**
 * POST /admin/videos
 * Admin uploads a video file. Multer puts the file at req.file.
 */
const uploadVideo = async (req, res, next) => {
  try {
    const { moduleId, title, description, order } = req.body;

    if (!moduleId || !title) {
      return res.status(400).json({ error: { message: 'moduleId and title are required' } });
    }
    if (!req.file) {
      return res.status(400).json({ error: { message: 'Video file is required' } });
    }

    // Upload to Bunny.net
    const bunnyData = await bunny.uploadVideo(title, req.file.path);
    const bunnyVideoId = bunnyData.guid;

    // Build URLs
    const streamUrl = bunny.getStreamUrl(bunnyVideoId);
    const embedUrl = bunny.getEmbedUrl(bunnyVideoId);
    const thumbnailUrl = bunny.getThumbnailUrl(bunnyVideoId);

    // Save to DB
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
    // Clean up temp file
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
  }
};

/**
 * GET /admin/videos
 * List all videos (admin).
 */
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

/**
 * DELETE /admin/videos/:id
 * Delete a video from DB and Bunny.net.
 */
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

/**
 * GET /videos/:id/stream
 * Return stream + embed URLs for an enrolled student.
 */
const getVideoUrls = async (req, res, next) => {
  try {
    const video = await Video.findOne({ _id: req.params.id, isActive: true });
    if (!video) {
      return res.status(404).json({ error: { message: 'Video not found' } });
    }

    res.json({
      videoId: video._id,
      title: video.title,
      streamUrl: video.url,
      embedUrl: video.embedUrl,
      thumbnailUrl: video.thumbnailUrl,
      durationSeconds: video.durationSeconds,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadVideo, listVideos, deleteVideo, getVideoUrls };
