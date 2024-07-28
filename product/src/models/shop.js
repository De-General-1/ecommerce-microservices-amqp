// src/models/shop.js
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image_path: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { collection: 'shops' });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
