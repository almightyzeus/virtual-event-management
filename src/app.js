require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('express-async-errors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// error handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// enforce required MONGO_URI and JWT_SECRET
if (!process.env.MONGO_URI) {
  console.error('FATAL: MONGO_URI is not set in environment. Exiting.');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set in environment. Exiting.');
  process.exit(1);
}
connectDB(process.env.MONGO_URI).catch(err => {
  console.error('DB connection error', err);
  process.exit(1);
});

// start server if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
