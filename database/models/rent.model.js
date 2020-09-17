const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
    client: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    items: {
        type: Array,
        required: true,
        minlength: 1,
        trim: true
    },
    dateStart: {
        type: Date,
        required: true,
        trim: true
    },
    dateEnd: {
        type: Date,
        required: true,
        trim: true
    }
})

const Rent = mongoose.model('Rent', RentSchema);

module.exports = {
    Rent
};