import mongoose from 'mongoose';
import { model, Schema} from 'mongoose';

const notificationSchema = new mongoose.Schema({
   email:{
     type: String,
     required: true,
     unique: true,
     match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
   },

    message: {
        type: String,
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread',
    },
    type: {
        type: String,
        enum: ['Account Creation', 'Payment Initiated', 'Approval Request', 'Inventory Update'],
      
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const notificationModel = mongoose.model('notification', notificationSchema);
export default notificationModel;
