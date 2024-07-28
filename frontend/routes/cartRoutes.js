const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.get('/', cartController.getCart);
// Route to render signup page
router.post('/addToCart', cartController.addToCart);
router.post('/removeFromCart/:id', cartController.removeFromCart);
router.post('/updateCart', cartController.updateCart);


module.exports = router;

