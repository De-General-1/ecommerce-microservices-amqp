const axios = require('axios');


exports.renderShopPage = async (req, res) => {

    res.render('shop')
}

exports.renderCreateListing = async (req, res) => {
    const shopId = req.params.shopId; // Assuming shopId is passed as a route parameter
  
    try {
      //Fetch categories from the backend
      const categoryResponse = await axios.get('http://localhost:3006/categories', {
        headers: {
          'Authorization': `Bearer ${req.session.token}`
        }
      });
  
      // Fetch shop details from the backend
      const shopResponse = await axios.get(`http://localhost:3006/shops/${shopId}/shop`, {
        headers: {
          'Authorization': `Bearer ${req.session.token}`
        }
      });
  
      const categories = categoryResponse.data;
      const shop = shopResponse.data;
  
      // Render the createListing page with categories and shop data
      res.render('createListing');
    } catch (error) {
      console.error('Error fetching data:', error);
      res.render('createListing');
    }
  };

exports.getShopDetails = async (req, res) => {
    const shopId = req.params.shopId;
    console.log("req.params from getShopDetails",req.params)
    try {
        const shopResponse = await axios.get(`http://localhost:3006/shops/${shopId}`, {
          headers: {
            'Authorization': `Bearer ${req.session.token}`
          }
        });
        const categoriesResponse = await axios.get(`http://localhost:3006/categories`, {
            headers: {
              'Authorization': `Bearer ${req.session.token}`
            }
          });
          const productResponse = await axios.get(`http://localhost:3006/shops/${shopResponse.data._id}/listings`, {
            headers: {
              'Authorization': `Bearer ${req.session.token}`
            }
          });

        console.log("response from shopcontroller:", shopResponse.data)
        const shop = shopResponse.data
        const categories = categoriesResponse.data
        const products = productResponse.data
    
        console.log("response from shop controller on c",categories)
        console.log("response from shop controller on p",products)
        if (req.headers.accept.includes('text/html')) {
          res.render('shop', { shop, categories, products });
        } else {
          res.json({ shop, categories, products });
        }
      } catch (error) {
        console.error('Error fetching shop details:', error);
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
      owner: userId
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
    console.error('Error creating shop:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
