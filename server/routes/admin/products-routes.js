const express = require('express');
const {
  handleImageUpload,
  addProduct,
  editProduct,
  deleteProduct,
  fetchAllProduct
} = require('../../controllers/admin/products-controller');
const { uploadSingleImage, uploadMultipleImages } = require('../../middleware/upload');

const router = express.Router();

// Single image upload endpoint (for backward compatibility)
router.post('/image-upload', uploadSingleImage, handleImageUpload);

// Create product with multiple images (up to 6)
router.post('/add', uploadMultipleImages, addProduct);

// Fetch all products
router.get('/get', fetchAllProduct);

// Edit product (supports image updates)
router.put('/edit/:id', uploadMultipleImages, editProduct);

// Delete product
router.delete('/delete/:id', deleteProduct);

module.exports = router;