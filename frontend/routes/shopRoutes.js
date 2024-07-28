const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');



router.get('/:shopId', shopController.getShopDetails);
router.get('/', shopController.renderShopPage);
router.post('/createShop', shopController.createShop);


module.exports = router;

