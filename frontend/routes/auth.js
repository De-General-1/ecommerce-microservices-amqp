const express = require('express');
const router = express.Router();
const frontendController = require('../controllers/frontendController');


router.get('/', frontendController.renderHomePage);
// Route to render signup page
router.get('/login', frontendController.renderRegisterPage);
router.post('/login', frontendController.login);
router.post('/register', frontendController.register);


module.exports = router;

