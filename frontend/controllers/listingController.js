const axios = require('axios');

exports.renderCreateListing = async (req, res) => {
    const shopId = req.params.shopId; // Assuming shopId is passed as a route parameter
  
    try {
      // Fetch categories from the backend
      const categoryResponse = await axios.get('http://localhost:3006/categories', {
        headers: {
          'Authorization': `Bearer ${req.session.token}`
        }
      });
  
      // Fetch shop details from the backend
      const shopResponse = await axios.get(`http://localhost:3006/shops/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${req.session.token}`
        }
      });
  
      const categories = categoryResponse.data;
      const shop = shopResponse.data;
  
      // Render the createListing page with categories and shop data
      res.render('createListing', {categories, shop});
    } catch (error) {
      console.error('Error fetching data:', error);
      res.render('createListing', { categories, shop});
    }
  };

exports.createListing = async (req, res) => {
    const { name, description, price, stock, categoryId, shopId, image_path } = req.body;
    const token = req.session.token;
  
    try {
        const response = await axios.post('http://localhost:3006/shops/listings', {
            name,
            description,
            price,
            stock,
            categoryId,
            shopId,
            image_path
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            res.redirect(`/shop/${shopId}`);
        } else {
            res.status(response.status).json(response.data);
        }
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.renderProductDetails = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Fetch product details from the backend
    const productResponse = await axios.get(`http://localhost:3006/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${req.session.token}`,
        'Content-Type': 'application/json'
      }
    });

    const product = productResponse.data;

    // Extract shopId and categoryId from the product details
    const { shopId, categoryId } = product;

    // Fetch shop details by shopId
    const shopPromise = axios.get(`http://localhost:3006/shops/${shopId}`, {
      headers: {
        'Authorization': `Bearer ${req.session.token}`,
        'Content-Type': 'application/json'
      }
    });

    // Fetch category details by categoryId
    const categoryPromise = axios.get(`http://localhost:3006/categories/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${req.session.token}`,
        'Content-Type': 'application/json'
      }
    });

    const cartPromise = fetch(`http://localhost:3006/products/cart/getCart`, {
      headers: {
        'Authorization': `Bearer ${req.session.token}`,
        'Content-Type': 'application/json'
      }
    });

    const productsPromise = fetch('http://localhost:3006/products', {
      headers: {
        'Authorization': `Bearer ${req.session.token}`,
        'Content-Type': 'application/json'
      }
    }); 

    // Await all promises
    const [shopResponse, categoryResponse, cartResponse, productsResponse] = await Promise.all([shopPromise, categoryPromise, cartPromise, productsPromise]);

    const shop = shopResponse.data;
    const category = categoryResponse.data;
    const cartData = await cartResponse.json();
    const productsData = await productsResponse.json();
    const totalItems = cartData.totalItems;
    console.log(productsData)
    // Render the product details page with the product, shop, and category data
    res.render('productDetails', { product, products: productsData, shop, category,totalItems });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};