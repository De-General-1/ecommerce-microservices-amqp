const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: false
    },
    quantity: {
        type: Number,
        required: false,
        min: 1
    },
    added_at: {
        type: Date,
        default: Date.now
    }
},
{timestamps: true }
);

const CartSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User'
    },
    items: [CartItemSchema]
  });

const Cart = mongoose.model("Cart", CartSchema)
module.exports = Cart;