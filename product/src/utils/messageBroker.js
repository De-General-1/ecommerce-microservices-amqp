const amqp = require('amqplib');
const config = require('../config');
const Listing = require('../models/product');

async function setupMessageBroker(exchange, exchangeType, queue, routingKey, messageHandler) {
  try {
    const connection = await amqp.connect(config.rabbitMQURI);
    const channel = await connection.createChannel();

    // Assert the exchange and queue
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    // Handle messages received on the queue
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const message = JSON.parse(msg.content.toString());
          console.log("Received message:", message);
          await messageHandler(message);
          channel.ack(msg); // Acknowledge message after successful processing
        } catch (error) {
          console.error("Error processing message:", error);
          // Optionally handle failed messages, e.g., requeue or move to a dead-letter queue
          channel.nack(msg); // Optionally reject the message
        }
      }
    });

    console.log(`Connected to RabbitMQ and waiting for messages on queue: ${queue}`);
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
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

async function updateInventory(item) {
  try {
    const listing = await Listing.findById(item.listingId);
    if (listing) {
      listing.stock -= item.quantity;
      await listing.save();
      console.log(`Stock of product ${item.listingId} updated successfully`);
    } else {
      console.warn(`Product ${item.listingId} not found`);
    }
  } catch (error) {
    console.error('Error updating inventory:', error);
  }
}

module.exports = {
  setupMessageBroker,
  sendToExchange,
  updateInventory,
};
