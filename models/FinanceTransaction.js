// models/FinanceTransaction.js
import mongoose from "mongoose";
import {model,Schema} from 'mongoose';

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
   
    date: {
        type: Date,
        defaceult: Date.now,
    },
    comment: {
        type: String,
    },
});

const financeModel = mongoose.model('finance', FinanceTransactionSchema);
export default financeModel;
