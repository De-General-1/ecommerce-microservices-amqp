const axios = require('axios');


exports.userDashboard = async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming you have the user ID stored in the session
    const token = req.session.token;   // Assuming you have a token stored in the session

    let shopData = null;
    let orders = [];
    let deliveries = [];

    // Check if the user is a shop owner
    try {
      const shopResponse = await axios.get(`http://localhost:3006/shops/${userId}/shop`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      shopData = shopResponse.data; // Store the shop data if the user is a shop owner
    } catch (shopError) {
      if (shopError.response && shopError.response.status === 404) {
        console.log('Shop not found for the user, proceeding with the rest of the implementation.');
      } else {
        console.error('Error checking shop ownership:', shopError);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    // Fetch user data
    const userResponse = await fetch(`http://localhost:3006/auth/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();

    // Fetch user orders
    try {
      const ordersResponse = await axios.get(`http://localhost:3006/orders/users/${userId}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      orders = ordersResponse.data;
    } catch (ordersError) {
      console.error('Error fetching user orders:', ordersError);
    }

    // Fetch deliveries for each order
    try {
      for (const order of orders) {
        const deliveriesResponse = await axios.get(`http://localhost:3006/deliveries/orders/${order._id}/deliveries`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        deliveries.push({
          orderId: order._id,
          delivery: deliveriesResponse.data
        });
      }
    } catch (deliveriesError) {
      console.error('Error fetching deliveries:', deliveriesError);
    }   
    console.log("from userDashboard:", deliveries)

    // Render the userDashboard view with user data, shop data, orders, and deliveries
    res.render('userDashboard', { user: userData, shop: shopData, orders, deliveries, token });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  exports.updateUserProfile = async (req, res) => {
    try {
      const userId = req.session.userId;
      const response = await fetch(`http://localhost:3006/auth/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${req.session.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        console.log(updatedUser)
        res.redirect('/userDashboard');
      } else {
        const errorData = await response.json();
        res.status(response.status).json(errorData);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.deleteAccount = async (req, res) => {
    try {
      const userId = req.session.userId;
      const response = await fetch(`http://localhost:3006/auth/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${req.session.token}`
        }
      });
  
      if (response.ok) {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to destroy session' });
          }
          res.redirect('/');
        });
      } else {
        const errorData = await response.json();
        res.status(response.status).json(errorData);
      }
    } catch (error) {
      console.error('Error deleting user account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };