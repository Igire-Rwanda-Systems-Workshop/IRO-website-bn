import mongoose from 'mongoose';
import { model, Schema} from 'mongoose';

const requestSchema = new mongoose.Schema({
    item_name:{
       type: String,
       required: true
    },
    item_description:{
        type: String,
        required: true
    },
    item_category: {
        type: String,
        required: true,
        enum: ['welfare', 'furniture','electronic']
    },
    quantity: {
        type: Number,
        required: true
    },
    unit_price: {
        type: Number,
        required: true
    },
    product_status: {
        type: String,
        required: true,
        enum: ['new', 'secondHand']
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: {
            values: ['pending', 'approved', 'denied'],
            message: '{VALUE} is not a valid status. Choose either "in progress", "approved", or "denied".'
    }
},
  date_requested: {
        type: Date,
        default: Date.now
    }
});

requestSchema.pre('save', function (next) {
    if (this.quantity && this.unit_price) {
        this.total_price = this.quantity * this.unit_price;
    }
    next();
});
requestSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.total_price = doc.total_price; 
        return ret;
    }
});
const requestModel = mongoose.model('request', requestSchema);
export default requestModel;