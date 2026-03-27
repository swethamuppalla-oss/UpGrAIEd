const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    videoUrl: { type: String, required: true, trim: true },
    duration: { type: Number, default: 0 }, // seconds
  },
  { timestamps: true }
);

videoSchema.index({ moduleId: 1 });

module.exports = mongoose.model('Video', videoSchema);
