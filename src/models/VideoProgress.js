const mongoose = require('mongoose');

const COMPLETION_THRESHOLD = 85;

const videoProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    percentWatched: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

videoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

videoProgressSchema.statics.COMPLETION_THRESHOLD = COMPLETION_THRESHOLD;

module.exports = mongoose.model('VideoProgress', videoProgressSchema);
