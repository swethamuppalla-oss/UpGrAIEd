import mongoose from 'mongoose'

const chapterSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: { type: String, default: 'Untitled Chapter' },
  subject: { type: String, default: '' },
  grade: { type: String, default: '' },
  photoUrls: [{ type: String }],
  extractedText: { type: String, default: '' },
  keyConcepts: [{ type: String }],
  vocabulary: [{ word: String, definition: String }],
  learningObjectives: [{ type: String }],
  detectedSubject: { type: String },
  detectedGrade: { type: String },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'complete', 'failed'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'ready', 'failed'],
    default: 'uploaded'
  },
  processingError: { type: String },
  weekPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WeekPlan'
  }
}, { timestamps: true })

export const Chapter = mongoose.model('Chapter', chapterSchema)
