const express = require('express');
const router = express.Router();
const { getAllOrdersByUser } = require('../../controllers/shop/order-controller');
const { authMiddleware } = require('../../middleware/auth');

/**
 * User Orders Routes
 * GET /api/users/:id/orders - Get all orders for a specific user
 */

router.get('/:id/orders', authMiddleware, getAllOrdersByUser);

module.exports = router;

