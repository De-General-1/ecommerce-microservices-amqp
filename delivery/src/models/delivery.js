const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  status: { type: String, enum: ['on hold', 'ready', 'on the way', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
