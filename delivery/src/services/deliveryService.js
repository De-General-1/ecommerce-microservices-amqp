const Delivery = require('../models/delivery');
const mongoose = require('mongoose');

async function createDelivery(deliveryData) {
  try {
    if (!deliveryData.orderId || !deliveryData.address || !deliveryData.phone) {
      throw new Error('Missing required fields: orderId, address, or phone');
    }

    const delivery = new Delivery({
      order: deliveryData.orderId,
      status: 'on hold',
      address: deliveryData.address,
      phone: deliveryData.phone
    });

    const savedDelivery = await delivery.save();
    console.log("Delivery successfully created and saved:", savedDelivery);

    // Log all deliveries to verify insertion
    const allDeliveries = await Delivery.find();
    return savedDelivery;
  } catch (err) {
    console.log("Error creating delivery:", err);
    throw err; // Rethrow error to be caught by the caller
  }
}

async function getDelivery(deliveryId) {
  console.log("In the delivery Service ID:", deliveryId);
  try {
    if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
      throw new Error('Invalid delivery ID format');
    }

    const objectId = new mongoose.Types.ObjectId(deliveryId);
    const delivery = await Delivery.findOne({ _id: objectId });
    
    console.log("Fetched Delivery:", delivery);
    if (!delivery) {
      throw new Error('Delivery not found');
    }
    return delivery;
  } catch (error) {
    console.error("Error in getDelivery:", error);
    throw error;
  }
}

async function updateDelivery(deliveryId, deliveryData) {
  try {
    const delivery = await Delivery.findByIdAndUpdate(deliveryId, deliveryData, { new: true });
    if (!delivery) {
      throw new Error('Delivery not found');
    }
    return delivery;
  } catch (error) {
    console.error("Error in updateDelivery:", error);
    throw error;
  }
}

// Function to handle new delivery message
async function handleNewDeliveryMessage(message) {
  const { orderId, address } = message;

  if (!orderId) {
    throw new Error('orderId is required');
  }

  try {
    const delivery = await createDelivery(orderId, address);
    console.log(`Delivery created for order ${orderId}`);
    return delivery;
  } catch (error) {
    console.error('Error processing new delivery:', error.message);
    throw error;
  }
}

async function getOrderDeliveries(orderId) {
  return Delivery.find({ order: orderId });
}

module.exports = {
  createDelivery,
  handleNewDeliveryMessage,
  getDelivery,
  updateDelivery,
  getOrderDeliveries,
};
