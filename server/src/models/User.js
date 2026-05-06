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
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Reference to the single active session token
    activeSessionToken: {
      type: String,
      default: null,
    },
    activeRefreshTokenHash: {
      type: String,
      default: null,
      select: false,
    },
    refreshTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    loginStreak: {
      type: Number,
      default: 0,
    },
    robProgress: {
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      badges: { type: [String], default: [] },
      lessonsCompleted: { type: [String], default: [] },
      questionsAnswered: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
      xpToday: { type: Number, default: 0 },
      lastModule: { type: String, default: null },
      weakTopics: { type: [String], default: [] },
      robName: { type: String, default: '' },
      robColor: { type: String, default: 'cyan' },
      updatedAt: Date,
    },
  },
  { timestamps: true }
);

userSchema.statics.ROLES = ROLES;

export const User = mongoose.model('User', userSchema);
export default User;
