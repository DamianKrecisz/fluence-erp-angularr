const mongoose = require('mongoose');
const { Product } = require('./product.model');

const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  productId: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  status: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  creationDate: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  author: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  value: {
    type: Number,
    required: true,
    minlength: 1,
    trim: true
  },
  comment: {
    type: String,
    required: false,
    trim: true
  }
})

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };