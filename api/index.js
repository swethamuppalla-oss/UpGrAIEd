import 'dotenv/config'
import { connectDB } from '../server/src/config/db.js'
import { createApp } from '../server/src/app.js'

let handler = null

export default async (req, res) => {
  if (!handler) {
    await connectDB()
    handler = createApp()
  }
  return handler(req, res)
}
