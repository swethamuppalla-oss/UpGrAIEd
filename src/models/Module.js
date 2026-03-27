const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    levelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Level',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    isMustDo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

moduleSchema.index({ levelId: 1 });

module.exports = mongoose.model('Module', moduleSchema);
