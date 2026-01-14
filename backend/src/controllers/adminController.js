/**
 * Admin Controller
 * Handles admin-specific operations like user management
 */

const User = require('../models/User');

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin only
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: error.message
    });
  }
};

/**
 * @desc    Block or unblock a user
 * @route   PUT /api/admin/block/:id
 * @access  Admin only
 */
const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from blocking themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot block yourself'
      });
    }

    // Toggle block status
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      }
    });

  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while blocking user',
      error: error.message
    });
  }
};

/**
 * @desc    Promote user to admin
 * @route   PUT /api/admin/promote/:id
 * @access  Admin only
 */
const promoteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already an admin
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is already an admin'
      });
    }

    // Promote to admin
    user.role = 'admin';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User promoted to admin successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      }
    });

  } catch (error) {
    console.error('Promote user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while promoting user',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/delete/:id
 * @access  Admin only
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete yourself'
      });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  blockUser,
  promoteUser,
  deleteUser
};