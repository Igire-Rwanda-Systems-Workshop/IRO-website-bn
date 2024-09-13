// models/FinanceTransaction.js
const mongoose = require('mongoose');

const FinanceTransactionSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Request', 
    },
    amount: {
        type: String,
        required: true,
    },
    // proofOfPayment: {
    //     type: String, 
    // },
    date: {
        type: Date,
        default: Date.now,
    },
    comment: {
        type: String,
    },
});

module.exports = mongoose.model('FinanceTransaction', FinanceTransactionSchema);
