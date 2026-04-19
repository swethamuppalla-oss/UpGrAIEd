// Vercel serverless entry point — wraps the Express app
// Strips the /api prefix that the frontend/Vite proxy adds,
// then delegates to the Express app with a cached DB connection.

require('dotenv').config();
const connectDB = require('../src/config/db');
const app = require('../src/app');

let dbConnected = false;

module.exports = async (req, res) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }

  // Frontend baseURL is /api, so requests arrive as /api/auth/... etc.
  // Express routes are defined without the /api prefix, so strip it here.
  req.url = req.url.replace(/^\/api/, '') || '/';

  return app(req, res);
};
