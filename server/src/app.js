import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import { errorHandler } from './middleware/errorHandler.js'
import { requireAuth } from './middleware/auth.js'

// Route imports
import authRouter      from './routes/auth.js'
import reservationRouter from './routes/reservations.js'
import studentRouter   from './routes/student.js'
import parentRouter    from './routes/parent.js'
import adminRouter     from './routes/admin.js'
import creatorRouter   from './routes/creator.js'
import videoRouter     from './routes/videos.js'
import paymentRouter   from './routes/payments.js'
import robRouter       from './routes/rob.js'
import progressRouter  from './routes/progress.js'
import configRouter    from './routes/config.js'
import uploadRouter    from './routes/upload.js'
import chapterRouter   from './routes/chapters.js'
import bloomRouter     from './routes/bloomRoutes.js'
import contentRouter   from './routes/content.js'

/**
 * Creates and returns a fully-configured Express app.
 * No app.listen() here — that lives in server.js (local dev)
 * and the Vercel serverless entry (server/api/index.js).
 */
export function createApp() {
  const app = express()

  // ── Security headers ─────────────────────────────────────────────────────────
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

  // ── Health check ─────────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }))

  // ── CORS ────────────────────────────────────────────────────────────────────
  const allowedOrigins = [
    'http://localhost:5173',
    'https://client-eight-eta-48.vercel.app',
    process.env.CLIENT_URL,
  ].filter(Boolean)

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow server-to-server / curl / Postman (no origin)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        // Also allow any *.vercel.app preview deployment
        if (/\.vercel\.app$/.test(origin)) return callback(null, true)
        callback(new Error(`CORS: origin ${origin} not allowed`))
      },
      credentials: true,
    })
  )

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // ── Public routes (no auth) ──────────────────────────────────────────────────
  app.use('/api/auth',    authRouter)
  app.use('/api/reserve', reservationRouter)
  app.use('/api/config',  configRouter)     // public reads; writes are guarded inside
  app.use('/api/content', contentRouter)   // dynamic content for growth pages

  // ── Protected routes ─────────────────────────────────────────────────────────
  app.use('/api/student',  requireAuth, studentRouter)
  app.use('/api/parent',   requireAuth, parentRouter)
  app.use('/api/admin',    requireAuth, adminRouter)
  app.use('/api/creator',  requireAuth, creatorRouter)
  app.use('/api/videos',   requireAuth, videoRouter)
  app.use('/api/payments', requireAuth, paymentRouter)
  app.use('/api/progress', requireAuth, progressRouter)
  app.use('/api/upload',   requireAuth, uploadRouter)
  app.use('/api/chapters', chapterRouter)   // auth checked per-route inside
  app.use('/api/rob',      robRouter)        // auth checked per-route inside
  app.use('/api/bloom',    bloomRouter)

  // Static uploads (local dev; on Vercel, uploads should use cloud storage)
  app.use('/uploads', express.static('uploads'))

  // ── Error handler (must be last) ─────────────────────────────────────────────
  app.use(errorHandler)

  return app
}
