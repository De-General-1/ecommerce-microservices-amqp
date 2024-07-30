const Listing = require('../models/product');
const Shop = require('../models/shop');
const Category = require('../models/category');
const Product = require('../models/product');

async function createListing(shopId, listingData) {
  const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new Error('Shop not found');
    }

    const category = await Category.findById(listingData.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const listing = new Listing({ ...listingData, shopId });
    await listing.save();
    return listing;
}

async function updateInventory(listingId, quantity) {
  const listing = await Listing.findById(listingId);
  if (listing) {
    listing.stock -= quantity;
    await listing.save();
  }
}

async function getAllListings() {
  return Listing.find();
}

async function getListings(shopId) {
  return Listing.find({ shopId });
}

async function getListing(listingId) {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new Error('Listing not found');
  }
  return listing;
}

async function updateListing(listingId, listingData) {
  const listing = await Listing.findByIdAndUpdate(listingId, listingData, { new: true });
  if (!listing) {
    throw new Error('Listing not found');
  }
  return listing;
}

async function deleteListing(listingId) {
  const listing = await Listing.findByIdAndDelete(listingId);
  if (!listing) {
    throw new Error('Listing not found');
  }
}

async function getProductsByShopId(shopId){
  try {
    return await Product.find({ shopId });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

async function searchListings(query) {
  try {
    const cleanQuery = {};

    // Iterate over each query parameter
    for (const [key, value] of Object.entries(query)) {
      if (key === 'categoryId' || key === 'shopId') {
        // Validate and convert to ObjectId if the key is an ID field
        if (mongoose.Types.ObjectId.isValid(value)) {
          cleanQuery[key] = mongoose.Types.ObjectId(value);
        } else {
          throw new Error(`Invalid ObjectId for ${key}`);
        }
      } else if (key === 'price') {
        // Handle price filtering (if implemented)
        cleanQuery[key] = Number(value);
      } else if (key === 'name') {
        // Use regex for partial matching (case-insensitive)
        cleanQuery[key] = { $regex: value, $options: 'i' };
      } else {
        // Default case, add directly to query
        cleanQuery[key] = value;
      }
    }

    console.log("Constructed query:", cleanQuery); // Debug the constructed query
    return Listing.find(cleanQuery);
  } catch (error) {
    throw new Error('Error searching listings: ' + error.message);
  }
}

module.exports = {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  searchListings,
  updateInventory,
  getAllListings,
  getProductsByShopId
};
