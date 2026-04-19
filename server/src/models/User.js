import mongoose from 'mongoose';

const ROLES = ['parent', 'student', 'admin', 'creator'];

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      sparse: true,
      trim: true,
    },
    email: {
      type: String,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
    // Reference to the single active session token
    activeSessionToken: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    robProgress: {
      xp: {
        type: Number,
        default: 0,
      },
      level: {
        type: Number,
        default: 1,
      },
      badges: {
        type: [String],
        default: [],
      },
      lessonsCompleted: {
        type: [String],
        default: [],
      },
      questionsAnswered: {
        type: Number,
        default: 0,
      },
      correctAnswers: {
        type: Number,
        default: 0,
      },
      xpToday: {
        type: Number,
        default: 0,
      },
      updatedAt: Date,
    },
  },
  { timestamps: true }
);

userSchema.statics.ROLES = ROLES;

export const User = mongoose.model('User', userSchema);
export default User;
