const axios = require('axios');


exports.renderShopPage = async (req, res) => {

    res.render('shop')
}

exports.getShopDetails = async (req, res) => {
    const shopId = req.params.shopId;
    console.log(req.params)
    try {
        const response = await axios.get(`http://localhost:3006/shops/${shopId}`, {
          headers: {
            'Authorization': `Bearer ${req.session.token}`
          }
        });
    
        const { shop, categories, products } = response.data;
    
        if (req.headers.accept.includes('text/html')) {
          res.render('shop', { shop, categories, products });
        } else {
          res.json({ shop, categories, products });
        }
      } catch (error) {
        console.error('Error fetching shop details:', error.message);
        res.status(500).json({ error: 'Internal server error' });
      }
  };

exports.createShop = async (req, res) => {
    const userId = req.session.userId;
  const token = req.session.token;

  try {
    const { name, description, image_path } = req.body;

    const response = await axios.post('http://localhost:3006/shops', {
      name,
      description,
      image_path,
      ownerId: userId  // Ensure to send ownerId as 'ownerId'
    }, {
      headers: {
        'Authorization': `Bearer ${token}` // Send token in headers
      }
    });

    if (response.status === 201) {
      // Extract shopId from the response
      const shopId = response.data._id;
      res.redirect(`/shop/${shopId}`); // Redirect to the shop details page
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error('Error creating shop:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
