const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../utils/isAuthenticated');

const router = express.Router();

router.post('/', authMiddleware, orderController.createOrder);
router.get('/:id', authMiddleware, orderController.getOrder);
router.get('/users/:userId/orders', authMiddleware, orderController.getUserOrders);
router.put('/:id', authMiddleware, orderController.updateOrder);
router.delete('/:id', authMiddleware, orderController.deleteOrder);

module.exports = router;
