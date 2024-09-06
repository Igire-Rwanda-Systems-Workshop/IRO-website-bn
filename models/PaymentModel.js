const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    finance_id: {
        type: String,
        required: true
    },
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_date: {
        type: Date,
        default: Date.now
    },
    proof_of_payment: {
        filename: {
            type: String,
            required: true
            
        },
        path: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        }
    },
    payment_method: {
        type: String,
        enum: ['cash', 'bank'],
        required: true
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);
