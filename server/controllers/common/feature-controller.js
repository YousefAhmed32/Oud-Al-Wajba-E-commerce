
const Feature = require('../../models/Feature')

const addFeatureImage = async (req, res) => {
  try {
    const { image, device } = req.body;

    if (!image || !device) {
      return res.status(400).json({ message: 'Image and device are required' });
    }

    const newFeature = new Feature({ image, device });
    await newFeature.save();

    res.status(201).json({ 
      success: true,
      message: 'Feature added successfully', 
      data: newFeature 
    });
  } catch (error) {
    console.error('Error adding feature:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMobileFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({ device: 'mobile' })
    res.status(200).json({
      success: true,
      data: images
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      success: false,
      message: 'Error is here'
    })
  }
}

const getDesktopFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({ device: 'desktop' })
    res.status(200).json({
      success: true,
      data: images
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      success: false,
      message: 'Error is here'
    })
  }
}

const deleteFeatureImages = async (req, res) => {
  try {
    const { id } = req.params
    const featureImages = await Feature.findByIdAndDelete(id)

    if (!featureImages) {
      res.status(404).json({
        success: false,
        message: "Feature Not found"
      })
    }
    res.status(200).json({
      success: true,
      message: "Feature is Deleted Successfully"
    })

  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: 'Error is here'
    })
  }
}
module.exports = {
  addFeatureImage,
  getDesktopFeatureImages,
  getMobileFeatureImages,
  deleteFeatureImages
}