import mongoose from 'mongoose'

// Sequential module unlock map — extend as curriculum grows
export const NEXT_MODULE_MAP = {
  'L1M1': 'L1M2',
  'L1M2': 'L1M3',
  'L1M3': 'L1M4',
  'L1M4': 'L1M5',
  'L1M5': 'L2M1',
  'L2M1': 'L2M2',
  'L2M2': 'L2M3',
  'L2M3': 'L2M4',
  'L2M4': 'L2M5',
  'L2M5': 'L3M1',
  'L3M1': 'L3M2',
  'L3M2': 'L3M3',
  'L3M3': 'L3M4',
  'L3M4': 'L3M5',
  // Also support the legacy mod1..mod5 IDs used by the curriculum stub
  'mod1': 'mod2',
  'mod2': 'mod3',
  'mod3': 'mod4',
  'mod4': 'mod5',
}

const studentProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // String so demo tokens ('demo') and real ObjectIds both work
      required: true,
      unique: true,
      index: true,
    },
    completedModules: {
      type: [String],
      default: [],
    },
    unlockedModules: {
      type: [String],
      default: ['L1M1'],
    },
    totalXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    streakDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastCompletedAt: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

// Compute current level from XP thresholds
studentProgressSchema.methods.computeLevel = function () {
  const thresholds = [0, 200, 500, 1000, 2000, 5000, 8000, 12000, 17000, 23000, 30000, 38000]
  let level = 1
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (this.totalXP >= thresholds[i]) {
      level = i + 1
      break
    }
  }
  return Math.min(level, 12)
}

export const StudentProgress = mongoose.model('StudentProgress', studentProgressSchema)
export default StudentProgress
