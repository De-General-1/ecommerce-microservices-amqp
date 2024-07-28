const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require("cors")

const path = require('path');
const app = express();

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:2999',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cartRoutes');
const shopRoutes = require('./routes/shopRoutes');
const userDashboardRoutes = require('./routes/userDashboardRoutes');

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware configuration
app.use(session({
    secret: 'your-secret-key_asdfghjkl', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
}));

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.token ? true : false;
    next();
});
// Routes
app.use('/', authRoutes);
app.use('/cart', cartRoutes);
app.use('/userDashboard', userDashboardRoutes);
app.use('/shop', shopRoutes);

const port = 2999;
app.listen(port, () => {
    console.log(`Frontend server is running on http://localhost:${port}`);
});
