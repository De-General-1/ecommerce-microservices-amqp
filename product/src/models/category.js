// src/models/category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  image_path: {
    type: String,
    required: true
  }
}, { collection: 'categories' });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
