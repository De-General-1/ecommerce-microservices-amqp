const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const cors = require('cors')
const listingRoutes = require("./routes/productRoutes");
const shopRoutes = require("./routes/shopRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const {setupMessageBroker} = require("./utils/messageBroker");

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
    this.app.use("/api/listings", listingRoutes);
    this.app.use('/api/categories', categoryRoutes);
    this.app.use('/api/shops', shopRoutes);
    this.app.use('/api/listings/cart', cartRoutes);
  }

  async setupMessageBroker() {
    await setupMessageBroker('listing_exchange', 'direct', config.rabbitMQQueue, 'listing.key', (message) => {
      console.log('Handling message in Listing Management Service:', message);
      // Add your message handling logic here

      // const parsedMessage = JSON.parse(message);
      // // Example logic: Process new listing
      // if (parsedMessage.type === config.NEW_LISTING) {
      //   listingService.createListing(parsedMessage.listingData);
      // }
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
