const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
    levelNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

levelSchema.index({ programId: 1, levelNumber: 1 });

module.exports = mongoose.model('Level', levelSchema);
