import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'document', 'other'],
    default: 'image'
  },
  section: {
    type: String,
    default: 'general'
  },
  tag: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Media = mongoose.model('Media', mediaSchema);
