const crypto = require('crypto');
const axios = require('axios');
const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Video = require('../models/Video');
const VideoProgress = require('../models/VideoProgress');

const FALLBACK_WATCH_HOURS = 340;

const toCreatorObjectId = (value) => {
  if (mongoose.isValidObjectId(value)) {
    return new mongoose.Types.ObjectId(value);
  }

  return new mongoose.Types.ObjectId(
    crypto.createHash('md5').update(String(value)).digest('hex').slice(0, 24)
  );
};

const uploadToBunny = async ({ title, fileBuffer }) => {
  const libraryId = process.env.BUNNY_LIBRARY_ID;
  const accessKey = process.env.BUNNY_API_KEY;

  if (!libraryId || !accessKey) {
    const bunnyVideoId = `mock-${Date.now()}`;
    return {
      bunnyVideoId,
      embedUrl: `https://iframe.mediadelivery.net/embed/mock-library/${bunnyVideoId}`,
    };
  }

  const createResponse = await axios.post(
    `https://video.bunnycdn.com/library/${libraryId}/videos`,
    { title },
    {
      headers: {
        AccessKey: accessKey,
        'Content-Type': 'application/json',
      },
    }
  );

  const bunnyVideoId = createResponse.data?.guid || createResponse.data?.videoLibraryId;
  if (!bunnyVideoId) {
    throw new Error('Bunny did not return a video id');
  }

  await axios.put(
    `https://video.bunnycdn.com/library/${libraryId}/videos/${bunnyVideoId}`,
    fileBuffer,
    {
      headers: {
        AccessKey: accessKey,
        'Content-Type': 'application/octet-stream',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );

  return {
    bunnyVideoId,
    embedUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${bunnyVideoId}`,
  };
};

const getStats = async (req, res, next) => {
  try {
    const creatorId = toCreatorObjectId(req.user.id);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const [totalStudents, studentsThisWeek, totalVideos, watchResult] = await Promise.all([
      Enrollment.countDocuments({ status: 'ACTIVE' }),
      Enrollment.countDocuments({ status: 'ACTIVE', createdAt: { $gte: weekStart } }),
      Video.countDocuments({
        creatorId,
        status: { $in: ['live', 'draft', 'processing'] },
      }),
      VideoProgress.aggregate([
        {
          $group: {
            _id: null,
            totalPercent: { $sum: '$percentWatched' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const avgCompletion = watchResult[0]
      ? Math.round(watchResult[0].totalPercent / watchResult[0].count)
      : 0;

    res.json({
      totalStudents,
      studentsThisWeek,
      totalVideos,
      totalWatchHours: FALLBACK_WATCH_HOURS,
      avgCompletion,
    });
  } catch (err) {
    next(err);
  }
};

const getVideos = async (req, res, next) => {
  try {
    const creatorId = toCreatorObjectId(req.user.id);
    const videos = await Video.find({ creatorId })
      .sort({ createdAt: -1 })
      .lean();

    const videosWithStats = await Promise.all(
      videos.map(async (video) => {
        const stats = await VideoProgress.aggregate([
          { $match: { video: video._id } },
          {
            $group: {
              _id: null,
              views: { $sum: 1 },
              avgCompletion: { $avg: '$percentWatched' },
            },
          },
        ]);

        return {
          ...video,
          views: stats[0]?.views || 0,
          avgCompletion: Math.round(stats[0]?.avgCompletion || 0),
        };
      })
    );

    res.json(videosWithStats);
  } catch (err) {
    next(err);
  }
};

const upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'Video file is required' } });
    }

    const { title, programme, level, moduleTitle, isMustDo, taskDescription } = req.body;

    if (!title || !programme || !level || !moduleTitle) {
      return res.status(400).json({
        error: { message: 'title, programme, level, and moduleTitle are required' },
      });
    }

    const creatorId = toCreatorObjectId(req.user.id);
    const bunnyAsset = await uploadToBunny({
      title,
      fileBuffer: req.file.buffer,
    });

    const video = await Video.create({
      title,
      creatorId,
      programme,
      level: Number(level),
      moduleTitle,
      isMustDo: String(isMustDo) === 'true',
      taskDescription,
      bunnyVideoId: bunnyAsset.bunnyVideoId,
      embedUrl: bunnyAsset.embedUrl,
      duration: 0,
      durationSeconds: 0,
      status: 'processing',
      isActive: true,
    });

    res.json({
      success: true,
      video: {
        ...video.toObject(),
        views: 0,
        avgCompletion: 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  getVideos,
  upload,
};
