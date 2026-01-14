/**
 * Express Application Setup
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboard.routes.js');
const userRoutes = require('./routes/user.routes');

const { apiLimiter } = require('./middleware/rateLimiter');


const app = express();
const path = require("path");

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// CORS
app.use(cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Apply rate limiting
app.use('/api/', apiLimiter);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User Management API v2.0 - Secure Edition',
    version: '2.0.0',
    security: {
      rateLimiting: 'Enabled',
      helmet: 'Enabled',
      xssProtection: 'Enabled',
      mongoSanitization: 'Enabled'
    },
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
