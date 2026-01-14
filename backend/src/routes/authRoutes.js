/**
 * Authentication Routes
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const {
  register,
  login,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const { authLimiter, resetPasswordLimiter } = require('../middleware/rateLimiter');
const User = require('../models/User');

const router = express.Router();

/**
 * ✅ Apply auth limiter
 * ❗ EXCLUDE Google OAuth route
 */
router.use((req, res, next) => {
  if (req.path === '/google') return next();
  authLimiter(req, res, next);
});

// =====================================
// 🔐 NORMAL AUTH ROUTES (UNCHANGED)
// =====================================

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', resetPasswordLimiter, forgotPassword);

// @route   POST /api/auth/reset-password/:token
router.post('/reset-password/:token', resetPassword);

// =====================================
// 🔐 GOOGLE LOGIN ROUTE
// =====================================

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    // Auto-create user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        password: 'google-auth',
        role: 'user'
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token: jwtToken,
      user
    });

  } catch (error) {
    console.error('❌ Google Auth Error:', error);

    res.status(401).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
});

module.exports = router;
