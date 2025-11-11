const mongoose = require('mongoose');

/**
 * Order Schema - Complete order management with payment proof upload
 * Supports both regular orders and free sample orders
 */
const orderSchema = new mongoose.Schema({
  // User information
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  // Order items - array of products with details
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    productImage: {
      type: String, // URL to product image
      default: ''
    }
  }],
  
  // Pricing breakdown
  totalBeforeDiscount: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  totalAfterDiscount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Address information
  address: {
    addressId: String,
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
  
  // Payment information
  payment: {
    method: {
      type: String,
      enum: ['COD', 'Free Sample', 'Transfer', 'phone', 'card'], // Support old methods for backward compatibility
      required: true
    },
    methodDetails: {
      // For phone payment: Qatar phone number
      // For card: last 4 digits (stored securely)
      phoneNumber: String,
      cardLast4: String
    },
    // Transfer information (for Transfer payment method)
    transferInfo: {
      fullName: String,
      amountTransferred: Number,
      image: {
        filename: String,
        path: String,
        url: String,
        mimetype: String,
        size: Number
      }
    },
    proofImage: {
      filename: String,
      path: String,
      url: String,
      mimetype: String,
      size: Number
    },
    status: {
      type: String,
      enum: ['awaiting_admin_approval', 'approved', 'rejected', 'failed', 'pending'],
      default: 'pending' // COD and Free Sample start as pending, Transfer as awaiting_admin_approval
    },
    adminNote: String, // Admin note when rejecting/approving
    approvedAt: Date,
    approvedBy: String // Admin userId
  },
  
  // Order status tracking
  orderStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'on the way', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Coupon information (snapshot)
  appliedCoupon: {
    code: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['percent', 'fixed'],
      default: 'percent'
    },
    value: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    }
  },
  couponCode: {
    type: String,
    default: ''
  },
  couponDiscount: {
    type: Number,
    default: 0
  },
  
  // Sample order flag
  isSampleOrder: {
    type: Boolean,
    default: false
  },
  
  // Legacy fields (for backward compatibility)
  cartId: String,
  cartItems: [{
    productId: String,
    title: String,
    image: String,
    price: String,
    quantity: Number
  }],
  addressInfo: mongoose.Schema.Types.Mixed,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for efficient queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ orderStatus: 1 });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
