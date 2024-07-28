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

    await channel.bindQueue(config.rabbitMQQueue, exchange, 'user.role.update');
    

    // Handle messages received on the queue
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        console.log("Received message:", msg.content.toString());
        messageHandler(msg.content.toString());

        if (message.type === 'UPDATE_USER_ROLE') {
          await updateUserRole(message.userId, message.newRole);
        }
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

async function updateUserRole(userId, newRole) {
  try {
    await User.findByIdAndUpdate(userId, { role: newRole });
    console.log(`User role updated: ${userId} to ${newRole}`);
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}

module.exports = {
  setupMessageBroker,
  sendToExchange,
  updateUserRole
};
