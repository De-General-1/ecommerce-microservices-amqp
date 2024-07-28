require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGODB_DELIVERY_URI_URI || 'mongodb://localhost/delivery_service',
    rabbitMQURI: 'amqp://localhost',
    rabbitMQQueue: 'delivery',
    port: 3003,
    NEW_USER: 'NEW_USER',
    NEW_LISTING: 'NEW_LISTING',
    NEW_ORDER: 'NEW_ORDER',
    NEW_DELIVERY: 'NEW_DELIVERY',
    
};
  