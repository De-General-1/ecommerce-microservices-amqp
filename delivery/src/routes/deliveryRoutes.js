const express = require('express');
const deliveryController = require('../controllers/deliveryController');
const authMiddleware = require('../utils/isAuthenticated');

const router = express.Router();

// router.post('/deliveries', authMiddleware, deliveryController.createDelivery);
router.get('/:id', authMiddleware, deliveryController.getDelivery);
router.put('/:id', authMiddleware, deliveryController.updateDelivery);
router.get('/orders/:orderId/deliveries', authMiddleware, deliveryController.getOrderDeliveries);

module.exports = router;
