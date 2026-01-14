/**
 * Express Application Setup
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require("path");

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboard.routes.js');
const userRoutes = require('./routes/user.routes');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Trust proxy (needed for Railway + rate-limit)
app.set("trust proxy", 1);

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// CORS Configuration
app.use(cors({
  origin: [
    "https://user-management-system-silk-mu.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate limiting
app.use('/api/', apiLimiter);

// Health Check
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
      admin: '/api/admin',
      dashboard: '/api/dashboard',
      user: '/api/user'
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
