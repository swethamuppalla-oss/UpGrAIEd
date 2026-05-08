import mongoose from 'mongoose';

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
    thumbnail: { type: String, trim: true, default: '' },
    durationSeconds: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

videoSchema.index({ module: 1, order: 1 });

export const Video = mongoose.model('Video', videoSchema);
export default Video;
