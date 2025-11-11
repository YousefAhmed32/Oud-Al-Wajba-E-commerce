const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  getUsersStats
} = require('../../controllers/admin/users-controller');
const { authMiddleware, isAdmin } = require('../../middleware/auth');

/**
 * Admin Users Management Routes
 * All routes require admin authentication
 */

// Get users statistics
router.get('/stats/summary', authMiddleware, isAdmin, getUsersStats);

// Get all users with filtering
router.get('/', authMiddleware, isAdmin, getAllUsers);

// Get specific user details with orders
router.get('/:id', authMiddleware, isAdmin, getUserDetails);

// Update user status (activate/deactivate)
router.put('/:id/status', authMiddleware, isAdmin, updateUserStatus);

module.exports = router;

