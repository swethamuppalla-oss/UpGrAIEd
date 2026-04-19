const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    grade: { type: String, trim: true },
    dateOfBirth: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
