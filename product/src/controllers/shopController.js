// src/controllers/shopController.js
const shopService = require('../services/shopService');
const categoryService = require('../services/categoryService');
const productService = require('../services/productsService'); 


exports.createShop = async (req, res) => {
  try {
    const shopData = {
        ...req.body,
        ownerId: req.user.id,
     }
    shop = await shopService.createShop(shopData);
    console.log(shop)
    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getShopById = async (req, res) => {
  try {
    console.log(req.params.shopId)
    const shop = await shopService.getShopById(req.params.shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Fetch categories and products related to the shop
    const categories = await categoryService.getCategoriesByShopId(req.params.shopId);
    const products = await productService.getProductsByShopId(req.params.shopId);
    res.status(200).json(
      shop,
      categories,
      products
    );
  } catch (error) {
    console.error("From shop controller: ",error)
    res.status(500).json({ error: error.message });
  }
};

exports.getAllShops = async (req, res) => {
  try {
    console.log("Entered shop controller")
    const shops = await shopService.getAllShops();
    res.status(200).json(shops);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

exports.getShopDetails = async (req, res) => {
  try {
    const shopId = req.params.shopId;

    // Fetch shop details
    console.log(shopId)
    const shop = await shopService.getShopById(shopId);

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Fetch categories and products related to the shop
    const categories = await categoryService.getCategoriesByShopId(shopId);
    const products = await productService.getProductsByShopId(shopId);

    res.status(200).json({
      shop,
      categories,
      products
    });
  } catch (error) {
    console.error('Error fetching shop details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
