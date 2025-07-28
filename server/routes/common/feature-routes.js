const express = require('express');
const router = express.Router();

const {
  addFeatureImage,
  getMobileFeatureImages,
  getDesktopFeatureImages,
  deleteFeatureImages,
} = require('../../controllers/common/feature-controller');

router.post('/add', addFeatureImage);
router.get('/get/desktop', getDesktopFeatureImages);
router.get('/get/mobile', getMobileFeatureImages);
router.delete('/delete/:id', deleteFeatureImages);

module.exports = router;