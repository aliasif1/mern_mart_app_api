const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        products: {
            type: Array,
        },
        shipTo: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'pending'
        }
    }, {timestamps: true}
);

module.exports = mongoose.model('order', orderSchema);