import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema({
  parentName: { type: String, required: true },
  childName: { type: String, required: true },
  grade: { type: String, required: true },
  city: String,
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  source: String,
  programme: String,
  status: { type: String, enum: ['pending', 'approved', 'paid'], default: 'pending' },
}, { timestamps: true })

export const Reservation = mongoose.model('Reservation', reservationSchema)
