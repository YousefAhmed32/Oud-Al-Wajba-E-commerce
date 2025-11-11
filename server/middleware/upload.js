const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Configure disk storage for multer
 * Stores files in /uploads/products directory
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/products');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-randomnumber-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const filename = `${basename}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

/**
 * File filter to validate image types
 * Only allows: jpg, jpeg, png, webp, gif
 */
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'), false);
  }
};

/**
 * Multer configuration
 * - Max file size: 5MB
 * - Storage: local disk in /uploads/products
 * - File filter: images only
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

/**
 * Configure storage for order proof images
 */
const proofStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/order-proofs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `proof-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

/**
 * Multer instance for order proof uploads
 */
const proofUpload = multer({
  storage: proofStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

/**
 * Middleware function to handle multiple image uploads
 * Accepts up to 6 images with field name "images"
 */
const uploadMultipleImages = upload.array('images', 6);

/**
 * Middleware function to handle single image upload
 * Accepts one image with field name "image"
 */
const uploadSingleImage = upload.single('image');

/**
 * Middleware function to handle payment proof upload
 * Accepts single file with field name "paymentProof"
 */
const uploadPaymentProof = proofUpload.single('paymentProof');

/**
 * Helper function to delete uploaded files on error
 * Used for cleanup when product creation fails
 */
const deleteUploadedFiles = (files) => {
  if (!files || files.length === 0) return;
  
  files.forEach(file => {
    if (file.path) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file ${file.path}:`, err);
        }
      });
    }
  });
};

module.exports = {
  upload,
  uploadMultipleImages,
  uploadSingleImage,
  uploadPaymentProof,
  proofUpload,
  deleteUploadedFiles
};

