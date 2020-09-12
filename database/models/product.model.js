const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  category: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    minlength: 1,
    trim: true
  },
  available: {
    type: Boolean,
    required: true
  }
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product };