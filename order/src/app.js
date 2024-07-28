const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const config = require("./config");
const orderRoutes = require("./routes/orderRoutes");
const orderService = require('./services/orderService'); // Import the orderService
const { setupMessageBroker } = require("./utils/messageBroker");

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
    this.setupMessageBroker();
  }

  async connectDB() {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    // CORS configuration
    const corsOptions = {
      origin: 'http://localhost:2999', // Frontend's domain
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };

    this.app.use(cors(corsOptions));
  }

  setRoutes() {
    this.app.use("/api/orders", orderRoutes);
  }

  async setupMessageBroker() {
    await setupMessageBroker('order_exchange', 'direct', config.rabbitMQQueue, 'order.key', async (message) => {
      console.log('Handling message in Order Management Service:', message);
      if (message.type === config.NEW_ORDER) {
        try {
          await orderService.createOrder(message.orderData);
        } catch (error) {
          console.error('Error processing new order:', error.message);
        }
      }
    });
  }

  start() {
    this.server = this.app.listen(config.port, () =>
      console.log(`Server started on port ${config.port}`)
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
