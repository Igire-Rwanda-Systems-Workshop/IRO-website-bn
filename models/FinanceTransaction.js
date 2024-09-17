import mongoose from "mongoose";
const { Schema } = mongoose;

const FinanceTransactionSchema = new Schema({
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
<<<<<<< HEAD
        default: Date.now,  
=======
        default: Date.now,
>>>>>>> 8aa3dc27e265d2faac9b36a5ba7cea2592a7b709
    },
    comment: {
        type: String,
    },
    status: {  
        type: String,
        enum: ['initiated', 'completed', 'pending', 'failed'],  
        default: 'pending',  
    },
});

// Export the model with a proper name
const FinanceTransaction = mongoose.model('FinanceTransaction', FinanceTransactionSchema);
export default FinanceTransaction;
