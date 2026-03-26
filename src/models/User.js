const mongoose = require('mongoose');

const ROLES = ['parent', 'student', 'admin'];

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    // Reference to the single active session token
    activeSessionToken: {
      type: String,
      default: null,
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
