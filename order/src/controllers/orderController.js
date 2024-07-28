const orderService = require('../services/orderService');

async function createOrder(req, res) {
  try {
    const user = req.user.id
    const {listings, address, phone } = req.body;
    const orderData = { user, listings, address, phone };
    const order = await orderService.createOrder(orderData);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getOrder(req, res) {
  try {
    const order = await orderService.getOrder(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function getUserOrders(req, res) {
  try {
    const orders = await orderService.getUserOrders(req.params.userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function updateOrder(req, res) {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteOrder(req, res) {
  try {
    await orderService.deleteOrder(req.params.id);
    res.status(204).json({ message: "Order deleted"});
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

module.exports = {
  createOrder,
  getOrder,
  getUserOrders,
  updateOrder,
  deleteOrder,
};
