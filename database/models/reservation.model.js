const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
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

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = {
    Reservation
};