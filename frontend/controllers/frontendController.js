const axios = require('axios');


exports.renderHomePage = async (req, res) => {
    try{
        const [shopsResponse, productsResponse, categoriesResponse, cartResponse] = await Promise.all([
            fetch('http://localhost:3006/shops'),
            fetch('http://localhost:3006/products'),
            fetch('http://localhost:3006/categories'),
            fetch('http://localhost:3006/products', {
                headers: {
                  'Authorization': `Bearer ${req.session.token}`
                }
              })
          ]);

          // Check if both responses are OK
            if (!shopsResponse.ok) {
                throw new Error(`Failed to fetch shops: ${shopsResponse.statusText}`);
            }
            if (!productsResponse.ok) {
                throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
            }
            const cartData = await cartResponse.json();
            const totalItems = cartData.totalItems;
            const shops = await shopsResponse.json();
            const products = await productsResponse.json();
            const categories = await categoriesResponse.json();
          res.render('index', { user: req.session.userId, shops, products,categories, totalItems });
    }catch(error){
        console.error(error);
        res.render('index', { user: req.session.userId, shops: [], products: [], categories: [] });
    }
};

exports.renderRegisterPage = (req, res) => {
    res.render('login', { error: null });
};

exports.register = async (req, res) => {
    const { username, email, password, address, phone } = req.body;
    try {
        const response = await axios.post('http://localhost:3006/auth/register', {
            username,
            email,
            password,
            address,
            phone
        });

        if (req.accepts('html')) {
            res.redirect('/login');
        } else if (req.accepts('json')) {
            res.json({ message: 'Signup successful', token: req.session.token });
        }
    } catch (error) {
        if (req.accepts('html')) {
            res.render('login', { error: error.response.data.error });
        } else if (req.accepts('json')) {
            res.status(400).json({ error: error.response.data.error });
        }
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await axios.post('http://localhost:3006/auth/login', { email, password });
        req.session.userId = response.data.user._id;
        req.session.token = response.data.token; // Store token in session

        if (req.accepts('html')) {
            res.redirect('/');
        } else if (req.accepts('json')) {
            res.json({ message: 'Login successful', token: req.session.token });
        }
    } catch (error) {
        if (req.accepts('html')) {
            console.log("Login error:", error.response.data.error)
            res.render('login', { error: error.response.data.error });
        } else if (req.accepts('json')) {
            res.status(400).json({ error: error.response.data.error });
        }
    }
};
