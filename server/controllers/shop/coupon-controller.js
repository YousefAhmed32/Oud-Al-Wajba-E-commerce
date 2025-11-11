const Coupon = require('../../models/Coupon');

/**
 * Validate coupon code
 * POST /api/coupons/validate
 * Request body: { code, orderAmount, userId? }
 */
const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount, userId } = req.body;
    
    if (!code || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'كود الخصم ومبلغ الطلب مطلوبان'
      });
    }
    
    // Find coupon
    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true
    });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'كود الكوبون غير موجود'
      });
    }
    
    // Check if valid
    const validation = coupon.isValid(userId || null);
    
    if (!validation.valid) {
      // Translate error messages to Arabic
      let arabicMessage = validation.reason || 'الكوبون غير صالح';
      if (validation.reason === 'You have already used this coupon') {
        arabicMessage = 'لقد استخدمت هذا الكوبون من قبل';
      } else if (validation.reason === 'Coupon has expired') {
        arabicMessage = 'الكوبون منتهي الصلاحية';
      } else if (validation.reason === 'Coupon is not active') {
        arabicMessage = 'الكوبون غير مفعّل حالياً';
      } else if (validation.reason === 'Coupon usage limit reached') {
        arabicMessage = 'تم الوصول إلى حد استخدام الكوبون';
      }
      
      return res.status(400).json({
        success: false,
        valid: false,
        message: arabicMessage
      });
    }
    
    // Calculate discount
    const discountCalc = coupon.calculateDiscount(orderAmount);
    
    if (!discountCalc.valid) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: discountCalc.reason || 'لا يمكن تطبيق الكوبون على هذا الطلب'
      });
    }
    
    res.status(200).json({
      success: true,
      valid: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: discountCalc.discountAmount,
        originalAmount: orderAmount,
        finalAmount: orderAmount - discountCalc.discountAmount,
        couponId: coupon._id
      }
    });
    
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({
      success: false,
      valid: false,
      message: 'فشل التحقق من الكوبون',
      error: error.message
    });
  }
};

module.exports = {
  validateCoupon
};

