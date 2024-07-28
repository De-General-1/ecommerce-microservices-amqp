const express = require("express");
const httpProxy = require("http-proxy");
const cors = require('cors')

const proxy = httpProxy.createProxyServer();
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:2999', // Frontend's domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Route requests to the auth service
app.use("/auth", (req, res) => {
  proxy.web(req, res, { target: "http://localhost:3005/api/users" });
});

// Route requests to the product service
app.use("/products", (req, res) => {
  proxy.web(req, res, { target: "http://localhost:3001/api/listings" });
});

// Route requests to the product service
app.use("/shops", (req, res) => {
  proxy.web(req, res, { target: "http://localhost:3001/api/shops" });
});
// Route requests to the product service
app.use("/categories", (req, res) => {
  proxy.web(req, res, { target: "http://localhost:3001/api/categories" });
});

// Route requests to the order service
app.use("/orders", (req, res) => {
  proxy.web(req, res, { target: "http://localhost:3009/api/orders" });
});

// Route requests to the delivery service
app.use("/deliveries", (req, res) => {
  proxy.web(req, res, { target: "http://localhost:3003/api/delivery" });
});

// Start the server
const port = process.env.PORT || 3006;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
