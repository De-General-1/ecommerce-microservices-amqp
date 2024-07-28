// services/cartService.js
const Cart = require('../models/cart');
const productService = require('../services/productsService')
const mongoose = require('mongoose')

async function addToCart(userId, productId, quantity = 1) {
  // Fetch product details
  const product = await productService.getListing(productId);

  // Check stock availability
  if (product.stock < quantity) {
    throw new Error('Product is out of stock');
  }
  const cart = await Cart.findOne({ userId });

  if (cart) {
    // Check if product already in cart
    const productIndex = cart.items.findIndex(item => item.product_id.equals(productId));
    if (productIndex > -1) {
      // Product exists in cart, update the quantity
      cart.items[productIndex].quantity += quantity;
    } else {
      // Product does not exist in cart, add new item
      cart.items.push({ product_id: productId, quantity });
    }
  } else {
    // No cart for user, create new cart
    const newCart = new Cart({
      userId,
      items: [{ product_id: productId, quantity }]
    });
    console.log(newCart)
    await newCart.save();
    return newCart;
  }
  
  await cart.save();
  return cart;
}

async function getCart(userId) {
    try{
        // Ensure userId is of type ObjectId
        const objectIdUserId = new mongoose.Types.ObjectId(userId);
        const cart = await Cart.findOne({ userId:objectIdUserId }).populate(`items.product_id`);
        if (!cart) {
            // No cart for user, create new cart
          const newCart = new Cart({
            userId: objectIdUserId,
            items: []
          });
          console.log(newCart)
          await newCart.save();
          return newCart;
        }
        return cart;
    }catch(error){
        console.error(error)
    }
    
}

async function removeFromCart(userId, productId) {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(item => !item.product_id.equals(productId));
  await cart.save();
  console.log("Removed from cart, cart updated");
  return cart;
}

async function updateCart(userId, items) {
  try {
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    const cart = await Cart.findOne({ userId: objectIdUserId });

    if (!cart) {
      throw new Error('Cart not found');
    }

    // Validate and update items
    for (let item of items) {
      const product = await productService.getListing(item.productId);
      if (product.stock < item.quantity) {
        throw new Error(`Product ${product.name} is out of stock`);
      }
    }

    // Clear the existing items and set the new ones
    cart.items = items.map(item => ({
      product_id: new mongoose.Types.ObjectId(item.productId),
      quantity: item.quantity
    }));

    await cart.save();
    return cart;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

async function updateCartItem(userId, productId, quantity) {
  try {
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    const objectIdProductId = new mongoose.Types.ObjectId(productId);

    const cart = await Cart.findOne({ userId: objectIdUserId });

    if (!cart) {
      throw new Error('Cart not found');
    }

    // Validate the product and quantity
    const product = await productService.getListing(productId);
    if (product.stock < quantity) {
      throw new Error(`Product ${product.name} is out of stock`);
    }

    // Find the item in the cart and update its quantity
    const itemIndex = cart.items.findIndex(item => item.product_id.equals(objectIdProductId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      throw new Error('Product not found in cart');
    }

    await cart.save();
    return cart;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
  updateCartItem
};
