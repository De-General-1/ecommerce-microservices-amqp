const amqp = require('amqplib');
const config = require('../config');
const User = require("../models/user"); // Import User model

async function setupMessageBroker(exchange, exchangeType, queue, routingKey, messageHandler) {
  try {
    const connection = await amqp.connect(config.rabbitMQURI);
    const channel = await connection.createChannel();

    // Assert the exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true });

    // Assert the queue
    await channel.assertQueue(queue, { durable: true });

    // Bind the queue to the exchange with the routing key
    await channel.bindQueue(queue, exchange, routingKey);

    // Handle messages received on the queue
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log("Received message:", message);

        // Parse the message once
        const parsedMessage = JSON.parse(message);
        console.log("Parsed message in user management:", parsedMessage);

        // Call the message handler with the parsed message
        messageHandler(parsedMessage);

        // Acknowledge the message
        channel.ack(msg);
      }
    });

    console.log(`Connected to RabbitMQ and waiting for messages on queue: ${queue}`);
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
  }
}

async function updateUserRole(userId, newRole) {
  try {
    const user = await User.findById(userId);
    if (user) {
      user.role = newRole;
      await user.save();
      console.log(`User role updated to ${newRole} for user ${userId}`);
    } else {
      console.log(`User with ID ${userId} not found`);
    }
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}

async function sendToExchange(exchange, routingKey, message) {
  try {
    const connection = await amqp.connect(config.rabbitMQURI);
    const channel = await connection.createChannel();

    // Assert the exchange
    await channel.assertExchange(exchange, 'direct', { durable: true });

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to exchange ${exchange} with routing key ${routingKey}`);
  } catch (error) {
    console.error('Failed to send message to RabbitMQ', error);
  }
}

module.exports = {
  setupMessageBroker,
  sendToExchange,
  updateUserRole
};
