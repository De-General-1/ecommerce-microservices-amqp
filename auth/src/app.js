const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const config = require("./config");
const userRoutes = require("./routes/userRoutes");
const { setupMessageBroker, updateUserRole } = require("./utils/messageBroker");



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
    this.app.use("/api/users", userRoutes);
  }

  async setupMessageBroker() {
    await setupMessageBroker('user_exchange', 'direct', config.rabbitMQQueue, 'user.role.update', async (message) => {
      console.log('Handling message in User Management Service:', message);

      const parsedMessage = (message);
      console.log("Parsed message in user management:", parsedMessage);

      // Example logic: Update user role
      if (parsedMessage.type === 'UPDATE_USER_ROLE') {
        try {
          await updateUserRole(parsedMessage.userId, parsedMessage.newRole);
        } catch (error) {
          console.log("Error updating user role:", error.message);
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
