const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const enrollmentRouter = require('./routes/enrollment');
const courseRouter = require('./routes/course');
const progressionRouter = require('./routes/progression');
const videoRouter = require('./routes/video');
const paymentRouter = require('./routes/payment');
const adminRouter   = require('./routes/admin');
const parentRouter  = require('./routes/parent');
const studentRouter = require('./routes/student');
const authenticate  = require('./middleware/authenticate');
const authorize     = require('./middleware/authorize');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check (no /api prefix — used by infra)
app.use('/health', healthRouter);

// All API routes under /api
app.use('/api/auth',       authRouter);
app.use('/api',            enrollmentRouter);
app.use('/api',            courseRouter);
app.use('/api',            progressionRouter);
app.use('/api',            videoRouter);
app.use('/api',            paymentRouter);
app.use('/api/admin',      authenticate, authorize('admin'), adminRouter);
app.use('/api/parent',     authenticate, authorize('parent'), parentRouter);
app.use('/api/student',   authenticate, studentRouter);

app.use(errorHandler);

module.exports = app;
