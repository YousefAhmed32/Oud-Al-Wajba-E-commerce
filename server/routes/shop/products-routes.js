const express = require('express');
const router = express.Router(); 
const { getFilterProducts , getProductDetails} = require('../../controllers/shop/products-controller');

router.get('/get', getFilterProducts);
router.get('/get/:id', getProductDetails);

module.exports = router;


// ******************    lol Error XD *********/
// const express = require('express');
// const router = require('../admin/products-routes');  <<=====
// const { getFilterProducts} = require('../../controllers/shop/products-controller');

// router.get('/get', getFilterProducts);

// module.exports = router;