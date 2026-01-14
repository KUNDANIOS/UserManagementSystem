/**
 * JWT Token Generator Utility
 */

const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      id: userId,
      role: role 
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

module.exports = generateToken;