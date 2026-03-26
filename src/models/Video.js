const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    url: { type: String, required: true, trim: true },
    durationSeconds: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

videoSchema.index({ module: 1, order: 1 });

module.exports = mongoose.model('Video', videoSchema);
