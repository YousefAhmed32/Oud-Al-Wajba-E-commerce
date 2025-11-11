const express = require('express');
const router = express.Router();
const { createOrder, getOrderDetails } = require('../../controllers/shop/checkout-controller');
const { proofUpload } = require('../../middleware/upload');
const { authMiddleware } = require('../../middleware/auth');

/**
 * Orders Routes
 * All routes require authentication
 */

// Create new order - upload middleware that allows optional file
const uploadOptionalTransferImage = (req, res, next) => {
  proofUpload.single('transferImage')(req, res, (err) => {
    // Log for debugging
    console.log('📤 Upload middleware:', {
      hasError: !!err,
      errorCode: err?.code,
      errorMessage: err?.message,
      hasFile: !!req.file,
      fileField: req.file?.fieldname
    });
    
    // Allow request to proceed if no file (for COD and Free Sample)
    // But reject if there's an actual upload error
    if (err) {
      // If file is missing, that's OK for non-Transfer methods
      if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.message?.includes('No file')) {
        console.log('⚠️ No file uploaded - OK for COD/Free Sample');
        return next();
      }
      // Other errors (size limit, invalid type, etc.) should be rejected
      console.error('❌ Upload error:', err);
      return next(err);
    }
    
    // If file was uploaded successfully, log it
    if (req.file) {
      console.log('✅ File uploaded successfully:', req.file.filename);
    }
    
    next();
  });
};

router.post('/', authMiddleware, uploadOptionalTransferImage, createOrder);

// Get order details by ID
router.get('/:id', authMiddleware, getOrderDetails);

module.exports = router;

