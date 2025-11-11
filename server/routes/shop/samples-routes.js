const express = require('express');
const router = express.Router();
const { requestSample, getUserSamples } = require('../../controllers/shop/sample-controller');

/**
 * Sample Request Routes
 * All routes require authentication
 */

// Request a free sample
router.post('/request', requestSample);

// Get user's sample requests
router.get('/', getUserSamples);

module.exports = router;

