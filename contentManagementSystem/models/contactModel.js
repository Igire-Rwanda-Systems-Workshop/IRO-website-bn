import mongoose from "mongoose";
import {model, Schema} from 'mongoose';

const contactSchema = new mongoose.Schema({
    names: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    }
});
const contactModel = mongoose.model('Contacts', contactSchema);
export default contactModel;
 