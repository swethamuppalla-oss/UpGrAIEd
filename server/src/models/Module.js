const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Level',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isMustDo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

moduleSchema.index({ level: 1, order: 1 });

module.exports = mongoose.model('Module', moduleSchema);
