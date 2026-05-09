import mongoose from 'mongoose';

const grippingPointSchema = new mongoose.Schema(
  {
    videoId:           { type: mongoose.Schema.Types.ObjectId, ref: 'Video',  required: true },
    moduleId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    timestampSeconds:  { type: Number, required: true, min: 0 },     // e.g. 135 = 2:15
    questionType:      { type: String, enum: ['mcq', 'typed'], default: 'mcq' },
    question:          { type: String, required: true, trim: true },
    options:           [{ type: String, trim: true }],               // MCQ only
    correctAnswer:     { type: String, required: true, trim: true },
    explanation:       { type: String, trim: true, default: '' },
    bloomReaction:     { type: String, trim: true, default: 'Great thinking! Let\'s keep going 🌿' },
    xpReward:          { type: Number, default: 10 },
    order:             { type: Number, default: 0 },
    isActive:          { type: Boolean, default: true },
  },
  { timestamps: true }
);

grippingPointSchema.index({ videoId: 1, order: 1 });
grippingPointSchema.index({ moduleId: 1 });

export const GrippingPoint = mongoose.model('GrippingPoint', grippingPointSchema);
export default GrippingPoint;
