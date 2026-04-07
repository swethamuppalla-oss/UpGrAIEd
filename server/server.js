const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const authenticate = require('./src/middleware/authenticate');
const authorize = require('./src/middleware/authorize');
const creatorRouter = require('./src/routes/creator');
const videoRouter = require('./src/routes/videos');
const paymentRouter = require('./src/routes/payments');
const studentController = require('./src/controllers/studentController');
const parentController = require('./src/controllers/parentController');
const reservationRouter = require('./src/routes/reservations');

const PORT = process.env.PORT || 5000;

const rootApp = express();
rootApp.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
rootApp.use(express.json());
rootApp.use('/api/reserve', reservationRouter);
rootApp.use('/api/creator', authenticate, authorize('creator'), creatorRouter);
rootApp.get('/api/parent/payment-status', authenticate, authorize('parent'), parentController.getPaymentStatus);
rootApp.use('/api/payments', authenticate, authorize('parent'), paymentRouter);
rootApp.get('/api/student/curriculum', authenticate, studentController.getCurriculum);
rootApp.use('/api/videos', authenticate, videoRouter);
rootApp.use(app);

const start = async () => {
  await connectDB();
  rootApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
