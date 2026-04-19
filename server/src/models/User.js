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
  },
  { timestamps: true }
);

userSchema.statics.ROLES = ROLES;

export const User = mongoose.model('User', userSchema);
export default User;
