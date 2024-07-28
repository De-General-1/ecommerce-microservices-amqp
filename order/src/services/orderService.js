const Order = require('../models/order');
const { sendToExchange } = require('../utils/messageBroker');
const config = require('../config');
const axios = require('axios')


async function calculateTotalPrice(listings) {
    let total = 0;
    for (const listing of listings) {
        const price = await getListingPrice(listing.listingId);
        listing.price = price; // Ensure the price is set in the listing object
        total += listing.quantity * price;
    }
    return Math.floor(total)
  } 

  async function getListingPrice(listingId) {
    try {
        const response = await axios.get(`http://localhost:3001/api/listings/${listingId}`);
        console.log(response.data.price)

        return response.data.price;
      } catch (error) {
        console.error(`Failed to get price for listing ${listingId}:`, error.message);
        throw new Error(`Unable to retrieve price for listing ${listingId}`);
      }
  }
async function createOrder(orderData) {
    try{
        const totalPrice = await calculateTotalPrice(orderData.listings);
        const order = new Order({
            user: orderData.user,
            listings: orderData.listings,
            address: orderData.address,
            phone: orderData.phone,
            totalPrice,
        });
        await order.save();
        // Notify Listings Service to update stock
        const stockUpdateMessage = {
            type: config.UPDATE_STOCK,
            orderId: order._id,
            items: orderData.items, // Assuming `items` contains listing IDs and quantities
        };
        await sendToExchange('listing_exchange', 'stock.key', stockUpdateMessage);

        // Notify Delivery Service to create a delivery
        const deliveryMessage = {
            type: config.NEW_DELIVERY,
            orderId: order._id,
            address: orderData.address, 
            phone: orderData.phone 
        };
        await sendToExchange('delivery_exchange', 'delivery.key', deliveryMessage);

        return order;
    }catch(error){
        console.log(error)
    }
  
}

async function getOrder(orderId) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
}

async function getUserOrders(userId) {
  return Order.find({ user: userId });
}

async function updateOrder(orderId, orderData) {
    const totalPrice = await calculateTotalPrice(orderData.listings);
    const order = await Order.findByIdAndUpdate(orderId, {...orderData, totalPrice}, { new: true });
  
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
}

async function deleteOrder(orderId) {
  const order = await Order.findByIdAndDelete(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
}

module.exports = {
  createOrder,
  getOrder,
  getUserOrders,
  updateOrder,
  deleteOrder,
  calculateTotalPrice,
  getListingPrice
};
