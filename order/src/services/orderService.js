const Order = require('../models/order');
const { sendToExchange } = require('../utils/messageBroker');
const config = require('../config');
const axios = require('axios')


async function calculateTotalPrice(listings) {
  let total = 0;
  for (const listing of listings) {
    const price = listing.price; // Price should be included in the listing object
    total += listing.quantity * price;
  }
  return Math.floor(total);
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
async function createOrder(orderData, token) {
  try {
    if (!Array.isArray(orderData.listings)) {
      throw new Error("Invalid listings format, expected an array.");
    }

    // Calculate total price
    const totalPrice = orderData.listings.reduce((sum, listing) => {
      if (typeof listing.price !== 'number' || typeof listing.quantity !== 'number') {
        throw new Error('Invalid listing data. Price and quantity must be numbers.');
      }
      return sum + listing.price * listing.quantity;
    }, 0);

    // Create and save the order
    const order = new Order({
      user: orderData.user,
      listings: orderData.listings,
      address: orderData.address,
      phone: orderData.phone,
      totalPrice: totalPrice
    });

    await order.save();

    // Notify Listings Service to update stock
    const stockUpdateMessage = {
      type: 'UPDATE_STOCK',
      orderId: order._id,
      items: orderData.listings // Format should be consistent
    };
    console.log(stockUpdateMessage);
    await sendToExchange('listing_exchange', 'stock.key', stockUpdateMessage);

      // Update stock in the Listings Service directly
      await updateListingStock(orderData.listings, token);

    // Notify Delivery Service to create a delivery
    const deliveryMessage = {
      type: 'NEW_DELIVERY',
      orderId: order._id,
      address: orderData.address,
      phone: orderData.phone,
    };
    await sendToExchange('delivery_exchange', 'delivery.key', deliveryMessage);

    return order;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw new Error('Error creating order: ' + error.message);
  }
  
}

async function updateListingStock(listings, token) {
  try {
    // Use Promise.all to handle multiple async operations
    await Promise.all(listings.map(async (listing) => {
      try {
        // Fetch current stock
        const response = await axios.get(`http://localhost:3006/products/${listing.listingId}`,{
          headers: { Authorization: `Bearer ${token}` }
        });
        const currentStock = response.data.stock;
        const updatedStock = currentStock - listing.quantity;

        // Update the stock
        await axios.put(`http://localhost:3006/products/${listing.listingId}`, 
          { stock: updatedStock },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(`Stock updated for product ${listing.listingId}: ${updatedStock}`);
      } catch (error) {
        console.error(`Failed to update stock for product ${listing.listingId}:`, error.message);
      }
    }));

    console.log("Stocks updated successfully");
  } catch (error) {
    console.error('Error updating stocks:', error);
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
    //const totalPrice = await calculateTotalPrice(orderData.listings);
    // Calculate total price
    const totalPrice = orderData.listings.reduce((sum, listing) => {
      if (typeof listing.price !== 'number' || typeof listing.quantity !== 'number') {
        throw new Error('Invalid listing data. Price and quantity must be numbers.');
      }
      return sum + listing.price * listing.quantity;
    }, 0);
  
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
