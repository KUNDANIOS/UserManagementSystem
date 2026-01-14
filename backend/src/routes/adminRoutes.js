/**
 * Admin Routes
 */

const express = require('express');
const {
  getAllUsers,
  blockUser,
  promoteUser,
  deleteUser
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply authentication and admin authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/block/:id', blockUser);
router.put('/promote/:id', promoteUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;