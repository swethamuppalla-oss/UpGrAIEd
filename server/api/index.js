/**
 * Vercel Serverless Entry Point (ESM)
 *
 * Routes registered in app.js already include the /api prefix
 * (e.g. /api/auth, /api/rob, /api/chapters …), so requests
 * arriving from the Vercel router as /api/... are handled directly
 * by Express — no prefix-stripping needed.
 */

import 'dotenv/config'
import { connectDB } from '../src/config/db.js'
import { createApp } from '../src/app.js'

// Cache across warm-start invocations
let handler = null

export default async (req, res) => {
  if (!handler) {
    await connectDB()
    handler = createApp()
  }
  return handler(req, res)
}
