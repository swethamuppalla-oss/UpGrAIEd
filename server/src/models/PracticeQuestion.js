import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  conceptId:  String,
  text:       { type: String, required: true },
  mode:       { type: String, default: 'normal' },
  answer:     String,
  templateId: String,
  createdAt:  { type: Date, default: Date.now, expires: 3600 },
})

export default mongoose.model('PracticeQuestion', schema)
