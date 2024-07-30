const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // Adjust the path as needed

// Route to render the placeOrder page
router.get('/placeOrder', orderController.renderPlaceOrder);
router.delete('/cancel/:orderId', orderController.cancelOrder);
router.post('/', orderController.createOrder);


module.exports = router;