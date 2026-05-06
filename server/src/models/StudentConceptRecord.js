import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
  isCorrect: { type: Boolean, required: true },
  mistakeType: { type: String, enum: ['conceptual', 'calculation', 'reading', null], default: null },
  at: { type: Date, default: Date.now },
}, { _id: false })

const schema = new mongoose.Schema({
  studentId: { type: String, required: true, index: true },
  conceptId: { type: String, required: true },
  history: { type: [answerSchema], default: [] },
  consecutiveCorrect: { type: Number, default: 0, min: 0 },
  consecutiveWrong: { type: Number, default: 0, min: 0 },
}, { timestamps: true })

schema.index({ studentId: 1, conceptId: 1 }, { unique: true })

export default mongoose.model('StudentConceptRecord', schema)
