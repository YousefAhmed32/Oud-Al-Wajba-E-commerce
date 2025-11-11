const express = require('express');
const router = express.Router();
const { validateCoupon } = require('../../controllers/shop/coupon-controller');

/**
 * Coupon Validation Routes
 */

// Validate coupon code
router.post('/validate', validateCoupon);

module.exports = router;

