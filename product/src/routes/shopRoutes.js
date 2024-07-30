// src/routes/shopRoutes.js
const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const listingController = require('../controllers/productController')
const isAuthenticated = require('../utils/isAuthenticated')

router.post('/',isAuthenticated, shopController.createShop);
router.get('/', shopController.getAllShops);
router.get('/:shopId', shopController.getShopById);
router.get('/:ownerId/shop', shopController.getShopByOwnerId);
router.post('/listings', isAuthenticated, listingController.createListing);
router.get('/:shopId/listings', listingController.getListings);

module.exports = router;
