require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGODB_ORDER_URI || 'mongodb://localhost/orders',
    rabbitMQURI: 'amqp://localhost',
    rabbitMQQueue: 'orders',
    port: 3009,
    NEW_USER: 'NEW_USER',
    NEW_LISTING: 'NEW_LISTING',
    NEW_ORDER: 'NEW_ORDER',
    NEW_DELIVERY: 'NEW_DELIVERY',
    listingServiceURL: 'http://localhost:3001'
    
};
  