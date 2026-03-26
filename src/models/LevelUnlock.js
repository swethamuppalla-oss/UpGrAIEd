const mongoose = require('mongoose');

const levelUnlockSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Level',
      required: true,
    },
    unlockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

levelUnlockSchema.index({ user: 1, level: 1 }, { unique: true });

module.exports = mongoose.model('LevelUnlock', levelUnlockSchema);
