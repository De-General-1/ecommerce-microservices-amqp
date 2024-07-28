const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const config = require("./config");
const deliveryRoutes = require("./routes/deliveryRoutes");
const deliveryService = require('./services/deliveryService'); // Import the deliveryService
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
    this.app.use("/api/delivery", deliveryRoutes);
  }

  async setupMessageBroker() {
    await setupMessageBroker('delivery_exchange', 'direct', config.rabbitMQQueue, 'delivery.key', async (message) => {
        console.log('Handling message in Delivery Management Service:', message);
        if (message.type === config.NEW_DELIVERY) {
            try {
                await deliveryService.createDelivery(message);
            } catch (error) {
                console.error('Error processing new delivery:', error.message);
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
