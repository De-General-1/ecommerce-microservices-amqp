const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const shopController = require('../controllers/shopController');


router.get('/:productId', listingController.renderProductDetails);
router.get('/createListing/:shopId', shopController.renderCreateListing);

module.exports = router;