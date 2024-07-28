// src/routes/shopRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const isAuthenticated = require('../utils/isAuthenticated')

router.post('/addToCart',isAuthenticated, cartController.addToCart);
router.get('/getCart',isAuthenticated, cartController.getCart);
router.delete('/removeFromCart/:productId', isAuthenticated, cartController.removeFromCart);
router.put('/updateCart', isAuthenticated, cartController.updateCart);
router.post('/updateCartItem', isAuthenticated, cartController.updateCartItem);

module.exports = router;
