const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const enrollmentRouter = require('./routes/enrollment');
const courseRouter = require('./routes/course');
const progressionRouter = require('./routes/progression');
const videoRouter = require('./routes/video');
const paymentRouter = require('./routes/payment');
const adminRouter = require('./routes/admin');
const parentRouter = require('./routes/parent');

const app = express();

// CORS for local Vite dev server
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'http://localhost:5173' || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/parent', parentRouter);
app.use('/', enrollmentRouter);
app.use('/', courseRouter);
app.use('/', progressionRouter);
app.use('/', videoRouter);
app.use('/', paymentRouter);
app.use('/', adminRouter);

app.use(errorHandler);

module.exports = app;
