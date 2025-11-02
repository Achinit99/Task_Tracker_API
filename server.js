// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// rate limit
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

app.get('/', (req, res) => res.json({ success: true, message: 'Task Tracker API running' }));

// mount API
app.use('/api/v1/tasks', tasksRouter);

// error handler
app.use((err, req, res ) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tasktracker')
    .then(() => {
      console.log('✅ MongoDB connected');
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
