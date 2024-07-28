const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { sendToExchange } = require('../utils/messageBroker');
const config  = require('../config');

async function registerUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const userEmail = userData.email
  const userExist = await User.findOne({ email: userEmail });
    if (userExist) {
      throw new Error('User already exists');
    }
    const user = new User({ ...userData, password: hashedPassword });
    await user.save();

  // Send message to RabbitMQ
  const message = {
    type: config.NEW_USER,
    userData: user,
  };
  await sendToExchange('user_exchange', 'user.key', message);

  return user;
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  return ({
    user,
    token
  });
}

async function getUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

async function updateUser(userId, userData) {
  const user = await User.findByIdAndUpdate(userId, userData, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

async function deleteUser(userId) {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error('User not found');
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
};
