const mongoose = require('mongoose');

const COMPLETION_THRESHOLD = 85; // percent

const videoProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    video: {
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

videoProgressSchema.index({ user: 1, video: 1 }, { unique: true });

videoProgressSchema.statics.COMPLETION_THRESHOLD = COMPLETION_THRESHOLD;

module.exports = mongoose.model('VideoProgress', videoProgressSchema);
