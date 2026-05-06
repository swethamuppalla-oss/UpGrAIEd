import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  conceptId: { type: String, required: true, index: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  type:       { type: String, enum: ['standard', 'same_pattern', 'remedial'], default: 'standard' },
  template:   { type: String, required: true }, // e.g. "What is {a} + {b}?"
  variables:  { type: mongoose.Schema.Types.Mixed, default: {} },
  // { a: { range: [1, 10] }, b: { range: [1, 10] } }
})

export default mongoose.model('QuestionTemplate', schema)
