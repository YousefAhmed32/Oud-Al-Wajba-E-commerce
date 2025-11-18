const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Get absolute path for uploads directory
 * Works correctly on both local and server environments
 */
const getUploadsPath = (subfolder = '') => {
  const baseDir = path.resolve(__dirname, '..');
  const uploadsDir = path.join(baseDir, 'uploads', subfolder);
  return uploadsDir;
};

/**
 * Ensure directory exists with proper permissions
 * Creates directory recursively with 755 permissions (rwxr-xr-x)
 */
const ensureDirectoryExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
      console.log(`✅ Created directory: ${dirPath}`);
    } else {
      // Ensure directory has correct permissions
      fs.chmodSync(dirPath, 0o755);
    }
    
    // Verify write permissions
    try {
      fs.accessSync(dirPath, fs.constants.W_OK);
    } catch (err) {
      console.error(`❌ No write permission for directory: ${dirPath}`);
      throw err;
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error ensuring directory exists: ${dirPath}`, error);
    throw error;
  }
};

/**
 * Configure disk storage for multer
 * Stores files in /uploads/products directory
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadDir = getUploadsPath('products');
      
      // Create directory if it doesn't exist with proper permissions
      ensureDirectoryExists(uploadDir);
      
      console.log(`📁 Product upload destination: ${uploadDir}`);
      cb(null, uploadDir);
    } catch (error) {
      console.error('❌ Error setting upload destination:', error);
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      // Generate unique filename: timestamp-randomnumber-originalname
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
      const filename = `${basename}-${uniqueSuffix}${ext}`;
      console.log(`📝 Generated filename: ${filename}`);
      cb(null, filename);
    } catch (error) {
      console.error('❌ Error generating filename:', error);
      cb(error, null);
    }
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
    try {
      const uploadDir = getUploadsPath('order-proofs');
      
      // Create directory if it doesn't exist with proper permissions
      ensureDirectoryExists(uploadDir);
      
      console.log(`📁 Order proof upload destination: ${uploadDir}`);
      cb(null, uploadDir);
    } catch (error) {
      console.error('❌ Error setting proof upload destination:', error);
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const filename = `proof-${uniqueSuffix}${ext}`;
      console.log(`📝 Generated proof filename: ${filename}`);
      cb(null, filename);
    } catch (error) {
      console.error('❌ Error generating proof filename:', error);
      cb(error, null);
    }
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
          console.error(`❌ Error deleting file ${file.path}:`, err);
        } else {
          console.log(`🗑️ Deleted file: ${file.path}`);
        }
      });
    }
  });
};

/**
 * Get upload paths for logging/debugging
 */
const getUploadPaths = () => {
  return {
    products: getUploadsPath('products'),
    orderProofs: getUploadsPath('order-proofs'),
    base: getUploadsPath()
  };
};

module.exports = {
  upload,
  uploadMultipleImages,
  uploadSingleImage,
  uploadPaymentProof,
  proofUpload,
  deleteUploadedFiles,
  getUploadPaths,
  ensureDirectoryExists
};

