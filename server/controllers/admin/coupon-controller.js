const Coupon = require("../../models/Coupon");

/**
 * Create Coupon
 * POST /api/admin/coupons
 * Body: { code, discountType, amount, expiresAt, usageLimitGlobal?, usageLimitPerUser?, minOrderAmount? }
 */
const createCoupon = async (req, res) => {
    try {
        const {
            code,
            discountType,
            amount,
            expiresAt,
            usageLimitGlobal,
            usageLimitPerUser,
            minOrderAmount,
            description
        } = req.body;
        
        // Validate required fields
        if (!code || !discountType || !amount || !expiresAt) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: code, discountType, amount, and expiresAt are required'
            });
        }
        
        // Validate discount type
        if (!['fixed', 'percent'].includes(discountType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid discountType. Must be "fixed" or "percent"'
            });
        }
        
        // Validate amount based on type
        if (discountType === 'percent' && (amount < 0 || amount > 100)) {
            return res.status(400).json({
                success: false,
                message: 'Percentage discount must be between 0 and 100'
            });
        }
        
        // Create coupon with new schema format
        const couponData = {
            code: code.toUpperCase().trim(),
            discountType,
            amount: parseFloat(amount),
            expiresAt: new Date(expiresAt),
            usageLimitGlobal: usageLimitGlobal ? parseInt(usageLimitGlobal) : null,
            usageLimitPerUser: usageLimitPerUser ? parseInt(usageLimitPerUser) : 1,
            minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
            description
        };
        
        // Legacy format for backward compatibility
        couponData.discount = discountType === 'percent' ? 'percentage' : 'Fixed';
        couponData.discountValue = amount;
        couponData.usageLimit = usageLimitGlobal || 1;
        couponData.expiryDate = new Date(expiresAt);
        
        const coupon = new Coupon(couponData);
        await coupon.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Coupon created successfully',
            data: coupon
        });
    } catch (e) {
        console.error('Error creating coupon:', e);
        
        // Handle duplicate code error
        if (e.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }
        
        res.status(400).json({
            success: false,
            message: 'Failed to create coupon',
            error: e.message
        });
    }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data: coupons,
        couponList: coupons // For backward compatibility
    });
  } catch (err) {
    console.error('Error fetching coupons:', err);
    res.status(500).json({
        success: false,
        message: 'Failed to fetch coupons',
        error: err.message
    });
  }
};


const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Convert legacy format to new format if needed
    if (updateData.discount) {
      updateData.discountType = updateData.discount === 'percentage' ? 'percent' : 'fixed';
    }
    if (updateData.discountValue !== undefined) {
      updateData.amount = updateData.discountValue;
    }
    if (updateData.expiryDate) {
      updateData.expiresAt = updateData.expiryDate;
    }
    if (updateData.usageLimit !== undefined) {
      updateData.usageLimitGlobal = updateData.usageLimit;
    }
    
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase().trim();
    }
    
    const updated = await Coupon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.status(200).json({
        success: true,
        message: 'Coupon updated successfully',
        data: updated
    });
  } catch (err) {
      console.error('Error updating coupon:', err);
      res.status(500).json({
          success: false,
          message: 'Failed to update coupon',
          error: err.message
      });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findByIdAndDelete(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully'
    });
  } catch (err) {
      console.error('Error deleting coupon:', err);
      res.status(500).json({
          success: false,
          message: 'Failed to delete coupon',
          error: err.message
      });
  }
};
module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};