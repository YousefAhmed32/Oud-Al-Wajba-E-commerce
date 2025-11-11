const SampleRequest = require('../../models/SampleRequest');
const Product = require('../../models/Product');

/**
 * Create a sample request
 * POST /api/samples/request
 */
const requestSample = async (req, res) => {
  try {
    const { productId, address } = req.body;
    const userId = req.user?.id || req.userId || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    if (!productId || !address) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and address are required'
      });
    }
    
    // Check if product exists and is sample eligible
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (!product.isSampleEligible) {
      return res.status(400).json({
        success: false,
        message: 'This product is not eligible for free samples'
      });
    }
    
    // Check if user already requested this product
    const canRequest = await SampleRequest.canUserRequest(userId, productId);
    
    if (!canRequest) {
      return res.status(400).json({
        success: false,
        message: 'You have already requested a sample for this product'
      });
    }
    
    // Check product sample limit
    if (product.sampleLimit !== null) {
      const existingRequests = await SampleRequest.countDocuments({
        productId,
        status: { $in: ['pending', 'approved', 'shipped', 'delivered'] }
      });
      
      if (existingRequests >= product.sampleLimit) {
        return res.status(400).json({
          success: false,
          message: 'Sample limit reached for this product'
        });
      }
    }
    
    // Parse address if string
    let addressData = {};
    try {
      addressData = typeof address === 'string' ? JSON.parse(address) : address;
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address format'
      });
    }
    
    // Create sample request
    const sampleRequest = new SampleRequest({
      userId,
      productId,
      address: addressData,
      status: 'pending'
    });
    
    await sampleRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'Sample request submitted successfully',
      data: sampleRequest
    });
    
  } catch (error) {
    console.error('Error creating sample request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sample request',
      error: error.message
    });
  }
};

/**
 * Get user's sample requests
 * GET /api/samples
 */
const getUserSamples = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId || req.query.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    const samples = await SampleRequest.find({ userId })
      .populate('productId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: samples
    });
    
  } catch (error) {
    console.error('Error fetching sample requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sample requests',
      error: error.message
    });
  }
};

module.exports = {
  requestSample,
  getUserSamples
};

