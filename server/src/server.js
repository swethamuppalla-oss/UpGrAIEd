import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requireAuth } from './middleware/auth.js'

// Route imports
import authRouter from './routes/auth.js'
import reservationRouter from './routes/reservations.js'
import studentRouter from './routes/student.js'
import parentRouter from './routes/parent.js'
import adminRouter from './routes/admin.js'
import creatorRouter from './routes/creator.js'
import videoRouter from './routes/videos.js'
import paymentRouter from './routes/payments.js'
import robRouter from './routes/rob.js'

const app = express()
await connectDB()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://client-eight-eta-48.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// PUBLIC routes (no auth)
app.use('/api/auth', authRouter)
app.use('/api/reserve', reservationRouter)

// PROTECTED routes (require auth)
app.use('/api/student', requireAuth, studentRouter)
app.use('/api/parent', requireAuth, parentRouter)
app.use('/api/admin', requireAuth, adminRouter)
app.use('/api/creator', requireAuth, creatorRouter)
app.use('/api/videos', requireAuth, videoRouter)
app.use('/api/payments', requireAuth, paymentRouter)
app.use('/api/rob', robRouter)

// Error handler (must be last)
app.use(errorHandler)

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port', process.env.PORT || 5000)
})
