const orderService = require('../services/orderService');

async function createOrder(req, res) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const user = req.user.id;
    const { listings, address, phone } = req.body;

    // Parse listings JSON string into an array of objects
    let parsedListings;
    try {
      parsedListings = JSON.parse(listings);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid listings format. Expected JSON.' });
    }

    // Construct order data
    const orderData = { user, listings: parsedListings, address, phone };

    // Create the order using the service
    const order = await orderService.createOrder(orderData, token);
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
