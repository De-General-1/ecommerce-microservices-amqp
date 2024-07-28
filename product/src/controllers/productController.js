const listingService = require('../services/productsService');
const shopService = require('../services/shopService')

async function createListing(req, res) {
  const { shopId, title, description, price, category, image_path } = req.body;
    const userId = req.user.id;
  try {
    // Verify if the user is the owner of the shop
    const isOwner = await shopService.verifyShopOwnership(userId, shopId);
    if (!isOwner) {
      return res.status(403).json({ message: 'You do not own this shop' });
    }
    const listing = await listingService.createListing(shopId, req.body);
    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getAllListings(req, res) {
  try {
    const listings = await listingService.getAllListings();
    res.status(200).json(listings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


async function getListings(req, res) {
  try {
    const listings = await listingService.getListings(req.params.shopId);
    res.status(200).json(listings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getListing(req, res) {
  try {
    const listing = await listingService.getListing(req.params.id);
    res.status(200).json(listing);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function updateListing(req, res) {
  try {
    const listing = await listingService.updateListing(req.params.id, req.body);
    res.status(200).json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteListing(req, res) {
  try {
    await listingService.deleteListing(req.params.id);
    res.status(204).json({ message: "listing deleted"});
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function searchListings(req, res) {
  try {
    const listings = await listingService.searchListings(req.query);
    res.status(200).json(listings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  searchListings,
  getAllListings
};
