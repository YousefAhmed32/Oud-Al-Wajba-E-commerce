const SampleRequest = require('../../models/SampleRequest');

/**
 * Get all sample requests (admin)
 * GET /api/admin/samples
 */
const getAllSamples = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    
    let filter = {};
    if (status) {
      filter.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const samples = await SampleRequest.find(filter)
      .populate('productId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await SampleRequest.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: samples,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
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

/**
 * Update sample request status (admin)
 * PUT /api/admin/samples/:id/status
 */
const updateSampleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;
    
    const validStatuses = ['pending', 'approved', 'shipped', 'delivered', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const sample = await SampleRequest.findById(id);
    
    if (!sample) {
      return res.status(404).json({
        success: false,
        message: 'Sample request not found'
      });
    }
    
    sample.status = status;
    if (adminNote) {
      sample.adminNote = adminNote;
    }
    sample.processedAt = new Date();
    sample.processedBy = req.user?.id || req.userId || 'admin';
    
    await sample.save();
    
    res.status(200).json({
      success: true,
      message: 'Sample request status updated successfully',
      data: sample
    });
    
  } catch (error) {
    console.error('Error updating sample request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sample request',
      error: error.message
    });
  }
};

module.exports = {
  getAllSamples,
  updateSampleStatus
};

