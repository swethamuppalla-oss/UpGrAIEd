const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: false,
      default: null,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    programme: { type: String, trim: true },
    level: { type: Number, min: 1, max: 11, default: 1 },
    moduleTitle: { type: String, trim: true },
    isMustDo: { type: Boolean, default: false },
    taskDescription: { type: String, trim: true },
    bunnyVideoId: { type: String, trim: true },
    url: { type: String, trim: true },
    embedUrl: { type: String, trim: true },
    thumbnailUrl: { type: String, trim: true },
    duration: { type: Number, default: 0 },
    durationSeconds: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['processing', 'live', 'draft'],
      default: 'processing',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

videoSchema.index({ module: 1, order: 1 });

module.exports = mongoose.model('Video', videoSchema);
