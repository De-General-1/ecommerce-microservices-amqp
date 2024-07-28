const axios = require('axios');

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const response = await fetch('http://localhost:3006/products/cart/addToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.token}` // Send token in headers
      },
      body: JSON.stringify({ product_id, quantity })
    });

    const result = await response.json();
    if (response.ok) {
    
      res.status(200).json({ message: 'Product added to cart successfully' });
    } else {
      res.status(response.status).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const response = await fetch('http://localhost:3006/products/cart/getCart', {
      headers: {
        'Authorization': `Bearer ${req.session.token}` // Send token in headers
      }
    });

    const cartData = await response.json();

    if (response.ok) {
      res.render('cart', { user: req.session.userId, cart: cartData, totalItems: cartData.totalItems, token: req.session.token });
    } else {
      res.status(response.status).json(cartData);
    }
  } catch (error) {
    console.error(error);
    res.render('cart', { user: req.session.userId, cart: {}, totalItems: 0, token: req.session.token});
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params; // Correctly get productId from params
    const response = await fetch(`http://localhost:3006/products/cart/removeFromCart/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${req.session.token}` // Corrected the token interpolation
      }
    });

    const result = await response.json();
    if (response.ok) {
      res.redirect('/cart');
    } else {
      res.status(response.status).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const response = await fetch('http://localhost:3006/products/cart/updateCart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.token}`
      },
      body: JSON.stringify({ quantities: req.body.quantities })
    });

    if (response.ok) {
      res.redirect('/cart');
    } else {
      const errorData = await response.json();
      res.status(response.status).json(errorData);
    }
  } catch (error) {
    console.error('Error updating cart on frontend:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
