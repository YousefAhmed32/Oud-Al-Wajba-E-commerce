const mongoose = require('mongoose');

/**
 * Sample Request Schema
 * Tracks free sample requests with rate limiting per user per product
 */
const sampleRequestSchema = new mongoose.Schema({
  // User who requested the sample
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  // Product for which sample is requested
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  
  // Delivery address
  address: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    pincode: String,
    phone: {
      type: String,
      required: true
    },
    notes: String,
    country: {
      type: String,
      default: 'Qatar'
    }
  },
  
  // Request status
  status: {
    type: String,
    enum: ['pending', 'approved', 'shipped', 'delivered', 'rejected'],
    default: 'pending'
  },
  
  // Admin notes
  adminNote: String,
  processedAt: Date,
  processedBy: String // Admin userId
}, {
  timestamps: true
});

// Compound index to prevent duplicate requests
sampleRequestSchema.index({ userId: 1, productId: 1 });

// Helper method to check if user can request another sample
sampleRequestSchema.statics.canUserRequest = async function(userId, productId) {
  const existingRequest = await this.findOne({
    userId,
    productId,
    status: { $in: ['pending', 'approved', 'shipped', 'delivered'] }
  });
  
  return !existingRequest;
};

module.exports = mongoose.models.SampleRequest || mongoose.model('SampleRequest', sampleRequestSchema);

