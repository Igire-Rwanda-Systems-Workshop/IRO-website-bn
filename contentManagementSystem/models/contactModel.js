import mongoose from "mongoose";
import {model, Schema} from 'mongoose';

const contactSchema = new mongoose.Schema({
    // bannerData1: {
    //     backgroundImage:{
    //         filename: String, 
    //         path: String, 
    //         mimetype: String, 
    //         size: Number 
    //     }, 
    //     },
        bannerData2: {
        title: {
            type: String,
            required: true
        },
        subTitle: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        label1: {
            type: String,
            required: true
        },
        textField1: {
            type: String,
            required: true
        },
        label2: {
            type: String,
            required: true
        },
        textField2: {
            type: String,
            required: true
        },
        label3: {
            type: String,
            required: true
        },
        textField3: {
            type: String,
            required: true
        },
        buttonOne: {
            type: String,
            required: true
        },   
    },
    contactInfo: {
        locationIcon:{
            filename: String, 
            path: String, 
            mimetype: String, 
            size: Number
        },
        location: {
            type: String,
            required: true
        },
        emailIcon: {
            filename: String, 
            path: String, 
            mimetype: String, 
            size: Number
        },
        email: {
            type: String,
            required: true
        },
        phoneIcon: {
            filename: String, 
            path: String, 
            mimetype: String, 
            size: Number
        },
        phoneNumber: {
            type: String,
            required: true
        },
    },
    socialMedia:{       
        twitterIcon: {
            filename: String, 
            path: String, 
            mimetype: String, 
            size: Number
        },
        twitterLink: {
            type: String,
            required: true
        },
        instagramIcon: {
            filename: String, 
            path: String, 
            mimetype: String, 
            size: Number
        },
        instagramLink: {
            type: String,
            required: true
        },
        linkedinIcon: {
            filename: String, 
            path: String, 
            mimetype: String, 
            size: Number
        },
        linkedinLink: {
            type: String,
            required: true
        }
    }
});

const contactModel = mongoose.model('contacts',contactSchema);
export default contactModel;