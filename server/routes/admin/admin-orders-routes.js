const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  approveOrder,
  rejectOrder,
  updateOrderStatus,
  getOrderDetails
} = require('../../controllers/admin/admin-order-controller');
const { authMiddleware, isAdmin } = require('../../middleware/auth');

/**
 * Admin Order Management Routes
 * All routes require admin authentication
 */

// Get all orders with filtering
router.get('/', authMiddleware, isAdmin, getAllOrders);

// Get specific order details
router.get('/:id', authMiddleware, isAdmin, getOrderDetails);

// Approve order payment
router.put('/:id/approve', authMiddleware, isAdmin, approveOrder);

// Reject order payment
router.put('/:id/reject', authMiddleware, isAdmin, rejectOrder);

// Update order status
router.put('/:id/status', authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;

