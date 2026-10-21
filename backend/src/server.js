const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Core Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    system: 'Smart Urban Noise Monitoring System API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mode: 'Prototype Demonstration (Sample Data / Simulated Noise Monitoring)',
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/hotspots', require('./routes/hotspotRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Root endpoint info
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Smart Urban Noise Monitoring System API',
    documentation: '/docs/API.md',
    health: '/api/health',
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`[Server] Smart Urban Noise API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[Server] API URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
  // Keep server running in development
});

module.exports = app;
