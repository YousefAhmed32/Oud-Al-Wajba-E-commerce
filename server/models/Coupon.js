const mongoose = require('mongoose');

/**
 * Coupon Schema - Enhanced coupon management with per-user limits
 * Supports both fixed amount and percentage discounts
 */
const couponSchema = new mongoose.Schema({
  // Coupon code (unique, case-insensitive)
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  
  // Discount type: 'fixed' (e.g., 50 QAR) or 'percent' (e.g., 20%)
  discountType: {
    type: String,
    enum: ['fixed', 'percent'],
    required: true
  },
  
  // Discount amount (fixed QAR amount or percentage 0-100)
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Validity period
  expiresAt: {
    type: Date,
    required: true
  },
  
  // Usage limits
  usageLimitGlobal: {
    type: Number,
    default: null // null means unlimited
  },
  usageLimitPerUser: {
    type: Number,
    default: 1 // Default: each user can use coupon once
  },
  
  // Usage tracking
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Per-user usage tracking (userId -> count)
  usedByUsers: [{
    userId: String,
    usageCount: {
      type: Number,
      default: 1
    },
    lastUsedAt: Date
  }],
  
  // Active status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Minimum order amount (optional)
  minOrderAmount: {
    type: Number,
    default: 0
  },
  
  // Description/notes
  description: String,
  
  // Legacy fields for backward compatibility
  discount: {
    type: String,
    enum: ['Fixed', 'percentage']
  },
  discountValue: Number,
  usageLimit: Number,
  expiryDate: Date
}, { 
  timestamps: true 
});

// Helper method to check if coupon is valid
couponSchema.methods.isValid = function(userId = null) {
  // Check if active
  if (!this.isActive) return { valid: false, reason: 'Coupon is not active' };
  
  // Check if expired
  if (new Date() > this.expiresAt) return { valid: false, reason: 'Coupon has expired' };
  
  // Check global usage limit
  if (this.usageLimitGlobal && this.usedCount >= this.usageLimitGlobal) {
    return { valid: false, reason: 'Coupon usage limit reached' };
  }
  
  // Check per-user usage limit
  if (userId && this.usageLimitPerUser) {
    // Ensure usedByUsers array exists
    const usedByUsers = this.usedByUsers || [];
    const userIdString = String(userId);
    const userUsage = usedByUsers.find(u => String(u.userId) === userIdString);
    if (userUsage && userUsage.usageCount >= this.usageLimitPerUser) {
      return { valid: false, reason: 'You have already used this coupon' };
    }
  }
  
  return { valid: true };
};

// Calculate discount amount
couponSchema.methods.calculateDiscount = function(orderAmount) {
  // Check minimum order amount
  if (this.minOrderAmount && orderAmount < this.minOrderAmount) {
    return { valid: false, reason: `Minimum order amount is ${this.minOrderAmount} QAR` };
  }
  
  let discountAmount = 0;
  
  if (this.discountType === 'fixed') {
    discountAmount = Math.min(this.amount, orderAmount); // Can't discount more than order total
  } else if (this.discountType === 'percent') {
    discountAmount = (orderAmount * this.amount) / 100;
  }
  
  return {
    valid: true,
    discountAmount: Math.round(discountAmount * 100) / 100 // Round to 2 decimals
  };
};

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
