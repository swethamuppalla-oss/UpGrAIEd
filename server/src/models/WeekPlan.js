import mongoose from 'mongoose'

const quizQuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctIndex: Number,
  explanation: String,
  concept: String
}, { _id: false })

const sectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['explanation', 'activity', 'quiz'],
    required: true
  },
  text: String,
  question: String,
  options: [String],
  answer: String
}, { _id: false })

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true }, // 1-7
  bloomLevel: { 
    type: String, 
    enum: ['remember', 'understand', 'apply', 'analyze', 'create'],
    required: true 
  },
  title: { type: String, required: true },
  estimatedTime: { type: Number, default: 5 },
  xpReward: { type: Number, default: 50 },
  sections: [sectionSchema],
  
  // Student progress on this day
  isComplete: { type: Boolean, default: false },
  completedAt: { type: Date },
  quizScore: { type: Number },
  timeSpentMinutes: { type: Number, default: 0 }
}, { _id: false })

const weekPlanSchema = new mongoose.Schema({
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekStartDate: { type: Date },
  days: [daySchema],
  status: {
    type: String,
    enum: ['draft', 'approved', 'active', 'complete'],
    default: 'draft'
  },
  parentApproved: { type: Boolean, default: false },
  parentApprovedAt: { type: Date },
  examScore: { type: Number },
  examTakenAt: { type: Date },
  overallProgress: { type: Number, default: 0 }
}, { timestamps: true })

export const WeekPlan = mongoose.model('WeekPlan', weekPlanSchema)
