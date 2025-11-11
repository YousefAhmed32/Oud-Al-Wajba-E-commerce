const express = require('express');
const router = express.Router();
const { getAllSamples, updateSampleStatus } = require('../../controllers/admin/sample-controller');

/**
 * Admin Sample Management Routes
 * All routes require admin authentication
 */

// Get all sample requests
router.get('/', getAllSamples);

// Update sample request status
router.put('/:id/status', updateSampleStatus);

module.exports = router;

