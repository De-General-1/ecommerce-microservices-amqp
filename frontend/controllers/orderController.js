const axios = require('axios');

exports.renderPlaceOrder = async (req, res) => {
    try {
        const userId = req.session.userId;

        // Fetch cart details
        const cartResponse = await axios.get('http://localhost:3006/products/cart/getCart', {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });

        // Fetch user details
        const userResponse = await axios.get(`http://localhost:3006/auth/${userId}`, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });

        const cartListings = cartResponse.data.items;
        const userData = userResponse.data;

        console.log("from place order...",cartListings)

        // Prepare the data to be sent to the EJS template
        const totalPrice = cartListings.reduce((total, listing) => total + (listing.price * listing.quantity), 0);

        res.render('placeOrder', {
            cartListings,
            userId : userData._id,
            userName: userData.username, // Assuming userData contains name
            userAddress: userData.address,
            userEmail: userData.email,
            userPhone: userData.phone,
            userRole: userData.role,
            totalPrice
        });
    } catch (error) {
        console.error('Error fetching data for place order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createOrder = async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming userId is stored in session
    
    // Extract listings, address, and phone from request body
    const { listings, address, phone } = req.body;

    // Log the parsed listings for debugging
    console.log("From create Order, parsed listings:", listings);
    console.log("Type of listings:", typeof listings);

    // Prepare the order data to send to the backend
    const orderData = {
      user: userId,
      listings: listings, // Assuming listings is an array of objects with listingId, quantity, and price
      address: address,
      phone: phone,
    };

    // Send order data to the backend order service
    const response = await axios.post('http://localhost:3006/orders', orderData, {
      headers: {
        'Authorization': `Bearer ${req.session.token}`
      }
    });

    // Handle the response from the backend
    if (response.status === 201) {
      res.redirect('/userDashboard');
    } else {
      res.status(response.status).json({ error: response.data.error });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
