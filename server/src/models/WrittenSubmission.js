import mongoose from 'mongoose'

const writtenSubmissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'WeekPlan' },
  questionText: { type: String, required: true },
  photoUrl: { type: String, required: true },
  ocrText: String,
  isCorrect: Boolean,
  score: Number,
  feedback: String,
  strengths: [String],
  improvements: [String],
  mistakeType: { type: String, enum: ['conceptual', 'calculation', 'reading', null] },
}, { timestamps: true })

export const WrittenSubmission = mongoose.model('WrittenSubmission', writtenSubmissionSchema)
