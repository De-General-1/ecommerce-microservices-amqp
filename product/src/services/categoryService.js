const Category = require('../models/category');

exports.getCategoriesByShopId = async (shopId) => {
  try {
    return await Category.find({ shopId });
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};
