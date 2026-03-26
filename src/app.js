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

const app = express();

app.use(express.json());

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/', enrollmentRouter);
app.use('/', courseRouter);
app.use('/', progressionRouter);
app.use('/', videoRouter);
app.use('/', paymentRouter);
app.use('/', adminRouter);

app.use(errorHandler);

module.exports = app;
