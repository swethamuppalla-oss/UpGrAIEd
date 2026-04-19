import mongoose from 'mongoose'

const robKnowledgeSchema = new mongoose.Schema({
  creatorId: {
    type: String,
    required: true,
    index: true,
  },
  moduleId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['concept', 'quiz', 'hint'],
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  question: {
    type: String,
    trim: true,
  },
  options: [{
    text: {
      type: String,
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  }],
  explanation: {
    type: String,
    trim: true,
  },
  triggerPhrase: {
    type: String,
    trim: true,
  },
  hintResponse: {
    type: String,
    trim: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

robKnowledgeSchema.index({ moduleId: 1, type: 1, isPublished: 1 })

export default mongoose.model('RobKnowledge', robKnowledgeSchema)
