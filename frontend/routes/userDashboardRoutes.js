const express = require('express');
const router = express.Router();
const userDashboardController = require('../controllers/userDashboardController');


router.get('/', userDashboardController.userDashboard);
router.post('/updateProfile', userDashboardController.updateUserProfile);
router.post('/deleteAccount', userDashboardController.deleteAccount);
// Route to render signup page



module.exports = router;

