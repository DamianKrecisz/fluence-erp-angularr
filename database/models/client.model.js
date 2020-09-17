const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  address: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  tax: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

const Client = mongoose.model('Client', ClientSchema);

module.exports = { Client };