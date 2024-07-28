const amqp = require('amqplib');
const config = require('../config');

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
        const message = JSON.parse(msg.content.toString());
        console.log("Received message:", message);
        await messageHandler(message);
        channel.ack(msg);
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

module.exports = {
  setupMessageBroker,
  sendToExchange,
};
