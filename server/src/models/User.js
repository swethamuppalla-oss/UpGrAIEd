const mongoose = require('mongoose');

const ROLES = ['parent', 'student', 'admin', 'creator'];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
    // Only set for admin — bcrypt hashed
    password: {
      type: String,
      select: false,
      default: null,
    },
    // Single-session enforcement
    activeSessionToken: {
      type: String,
      select: false,
      default: null,
    },
    // Device tracking — max 2 per account
    deviceIds: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.statics.ROLES = ROLES;

module.exports = mongoose.model('User', userSchema);
