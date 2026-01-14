/**
 * User Model
 * Defines the user schema and model for MongoDB
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    isBlocked: {
      type: Boolean,
      default: false
    },
    avatar: {
  type: String,
  default: ""
},
    profilePic: { type: String },



    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // 🔐 MFA / OTP FIELDS (NEW)
    mfaEnabled: {
      type: Boolean,
      default: false
    },

    mfaType: {
      type: String,
      enum: ['email', 'totp'],
      default: null
    },

    otpHash: {
      type: String
    },

    otpExpiry: {
      type: Date
    },

    totpSecret: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// 🔒 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔑 Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
