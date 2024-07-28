require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGODB_AUTH_URI,
  jwtSecret: process.env.JWT_SECRET || "secret",
  rabbitMQURI: process.env.RABBITMQ_URI || "amqp://localhost",
  rabbitMQQueue: "user_queue",
  port: process.env.PORT || 3005,
  NEW_USER: 'NEW_USER',
  NEW_LISTING: 'NEW_LISTING',
  NEW_ORDER: 'NEW_ORDER',
  NEW_DELIVERY: 'NEW_DELIVERY',
};
