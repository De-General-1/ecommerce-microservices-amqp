const deliveryService = require('../services/deliveryService');
const mongoose = require("mongoose")

// async function createDelivery(req, res) {
//   try {
//     const delivery = await deliveryService.createDelivery(req.body);
//     res.status(201).json(delivery);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// }

async function getDelivery(req, res) {
  try {
    const deliveryId = req.params.id;
    console.log('Delivery ID from request:', deliveryId);

    if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
      return res.status(400).json({ error: 'Invalid delivery ID format' });
    }

    const delivery = await deliveryService.getDelivery(deliveryId);
    console.log("controller delivery:", delivery);
    res.status(200).json(delivery);
  } catch (error) {
    console.error("Error in getDelivery controller:", error);
    res.status(404).json({ error: error.message });
  }
}

async function updateDelivery(req, res) {
  try {
    const delivery = await deliveryService.updateDelivery(req.params.id, req.body);
    res.status(200).json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getOrderDeliveries(req, res) {
  try {
    const deliveries = await deliveryService.getOrderDeliveries(req.params.orderId);
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

module.exports = {
//   createDelivery,
  getDelivery,
  updateDelivery,
  getOrderDeliveries,
};
