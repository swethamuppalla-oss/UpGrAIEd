import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
  questionIndex: Number,
  question: String,
  selectedIndex: Number,
  correctIndex: Number,
  isCorrect: Boolean,
  timeTakenSeconds: Number
}, { _id: false })

const examResultSchema = new mongoose.Schema({
  weekPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WeekPlan',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },
  answers: [answerSchema],
  totalQuestions: Number,
  correctAnswers: Number,
  score: Number,         // percentage 0-100
  timeTakenMinutes: Number,
  weakConcepts: [String],
  strongConcepts: [String],
  parentNotified: { type: Boolean, default: false }
}, { timestamps: true })

export const ExamResult = mongoose.model('ExamResult', examResultSchema)
