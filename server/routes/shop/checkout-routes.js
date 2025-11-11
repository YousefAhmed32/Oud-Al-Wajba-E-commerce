const express = require('express');
const router = express.Router();
const { createOrder, getOrderDetails } = require('../../controllers/shop/checkout-controller');
const { uploadPaymentProof } = require('../../middleware/upload');

/**
 * Checkout Routes
 * All routes require authentication
 */

// Create new order with payment proof upload
router.post('/create-order', uploadPaymentProof, createOrder);

// Get order details
router.get('/:id', getOrderDetails);

module.exports = router;

