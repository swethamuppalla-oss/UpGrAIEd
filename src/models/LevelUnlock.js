const mongoose = require('mongoose');

const levelUnlockSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    levelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Level',
      required: true,
    },
    unlockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

levelUnlockSchema.index({ userId: 1, levelId: 1 }, { unique: true });

module.exports = mongoose.model('LevelUnlock', levelUnlockSchema);
