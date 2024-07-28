const express = require('express');
const listingController = require('../controllers/productController');
const cartController = require('../controllers/cartController')
const authMiddleware = require('../utils/isAuthenticated');

const router = express.Router();

router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListing);
//router.get('/:shopId', listingController.getProductByShop);
router.put('/:id', authMiddleware, listingController.updateListing);
router.delete('/:id', authMiddleware, listingController.deleteListing);
router.get('/search', listingController.searchListings);
// Add to cart route
router.post('/addToCart',authMiddleware, cartController.addToCart);
// Get cart route
router.get('/getCart',authMiddleware, cartController.getCart);
// Remove from cart route
router.post('/removefromCart',authMiddleware, cartController.removeFromCart);

module.exports = router;
