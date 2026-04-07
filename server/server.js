require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const authenticate = require('./src/middleware/authenticate');
const authorize = require('./src/middleware/authorize');
const creatorRouter = require('./src/routes/creator');

const PORT = process.env.PORT || 5000;

app.use('/api/creator', authenticate, authorize('creator'), creatorRouter);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
