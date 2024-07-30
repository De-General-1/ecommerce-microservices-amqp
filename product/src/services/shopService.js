// src/services/shopService.js
const Shop = require('../models/shop');
const {sendToExchange} = require('../utils/messageBroker')

class ShopService {
  async createShop(data) {

    const shop = new Shop({
        ...data,
        owner: data.ownerId, // Ensuring the ownerId is set correctly
    });
    await shop.save();

    // Send a message to User Management Service to update the user role
    const message = {
        type: 'UPDATE_USER_ROLE',
        userId: data.ownerId,
        newRole: 'shopOwner'
    };

    await sendToExchange('user_exchange', 'user.role.update', message);
    return(shop)
    }
  async getShopById(id) {
    return Shop.findById(id);
  }
  async getShopByOwnerId(ownerId) {
    console.log("Entered OwnerId stuff")
    return Shop.findOne({ owner: ownerId});
  }

  async getAllShops() {
    return Shop.find();
  }

  async verifyShopOwnership(userId, shopId) {
    const shop = await Shop.findOne({ _id: shopId, owner: userId });
    return shop !== null;
  }
}

module.exports = new ShopService();
