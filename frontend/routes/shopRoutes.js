const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const listingController = require('../controllers/listingController');



router.get('/:shopId', shopController.getShopDetails);
router.get('/', shopController.renderShopPage);
router.post('/createShop', shopController.createShop);
router.post('/createListing', listingController.createListing);
router.get('/createListing/:shopId', listingController.renderCreateListing);

module.exports = router;

