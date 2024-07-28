const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listings: [
    {
      listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  address: { type: String, required: true },
  phone: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
