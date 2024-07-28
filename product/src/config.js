require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoURI: process.env.MONGODB_PRODUCT_URI || "mongodb://localhost/products",
  rabbitMQURI: process.env.RABBITMQ_URI || "amqp://localhost",
  rabbitMQQueue: "products_queue",
  exchangeName: "products",
  NEW_USER: 'NEW_USER',
  NEW_LISTING: 'NEW_LISTING',
  NEW_ORDER: 'NEW_ORDER',
  NEW_DELIVERY: 'NEW_DELIVERY',
};
