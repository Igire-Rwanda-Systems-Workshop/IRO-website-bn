const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,  // Field to store OTP
    },
    otpExpires: {
        type: Date, // Field to store OTP expiration
    },
    role: {
        type: String,
        enum: ['Operation Manager', 'Project Director', 'Finance Manager'],
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
