// controllers/cartController.js
const cartService = require('../services/cartService');

async function addToCart(req, res) {
  try {
    const userId = req.user.id;
    console.log("userId from addToCart", userId)
    console.log("req.user from addToCart", req.user)

    const { product_id, quantity } = req.body;
    const cart = await cartService.addToCart(userId, product_id, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getCart(req, res) {
  try {
    const userId = req.user.id;
    console.log("req.user from getCart", req.user);
  
    // Check if the cart exists for the user
    let cart = await cartService.getCart(userId);
  
    // If cart does not exist, create an empty cart
    if (!cart) {
      cart = await cartService.createCart(userId);
    }
  
    // Simplify the cart structure for response
    const simplifiedCart = {
      _id: cart._id,
      userId: cart.userId,
      items: cart.items.map(item => {
        if (item.product_id) {
          return {
            productId: item.product_id._id,
            name: item.product_id.name,
            description: item.product_id.description,
            price: item.product_id.price,
            stock: item.product_id.stock,
            quantity: item.quantity,
            totalItemPrice: Math.round(item.product_id.price * item.quantity),
          };
        } else {
          return {
            productId: null,
            name: 'Unknown',
            description: 'No description',
            price: 0,
            stock: 0,
            quantity: item.quantity,
            totalItemPrice: 0,
          };
        }
      }),
      totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: cart.items.reduce((sum, item) => sum + (item.product_id ? item.product_id.price * item.quantity : 0), 0)
    };
  
    res.status(200).json(simplifiedCart);
  } catch (error) {
    console.log("Error from controller getCart", error);
    console.error("Error from Cart Controller:", error);
    res.status(404).json({ error: error.message });
  }
}

async function removeFromCart(req, res) {
  try {
    const userId = req.user.id;
    const {productId} = req.params; // Get productId from params
    const cart = await cartService.removeFromCart(userId, productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateCart(req, res) {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request
    const { items } = req.body; // Expecting items to be an array of { productId, quantity }
    const updatedCart = await cartService.updateCart(userId, items);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error in updateCart controller:', error);
    res.status(400).json({ error: error.message });
  }
}

async function updateCartItem (req, res) {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request
    const { productId, quantity } = req.body; // Expecting productId and quantity in the request body

    const updatedCart = await cartService.updateCartItem(userId, productId, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error in updateCartItem controller:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
  updateCartItem
};
