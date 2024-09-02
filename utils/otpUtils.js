const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Function to generate OTP and send it via email
const sendOtp = async (email) => {
    try {
        // Generate a random OTP
        const otp = crypto.randomInt(100000, 999999);

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        // Store OTP and expiration time in user document
        user.otp = otp;
        user.otpExpires = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
        await user.save();

        // Setup email transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send OTP email
        await transporter.sendMail({
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 15 minutes.`
        });

        return otp;
    } catch (error) {
        console.error('Error in sendOtp:', error.message);
        throw error;
    }
};

// Function to validate OTP
const validateOtp = async (email, otp) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return { isValid: false, message: 'User not found' };
        }

        // Check if OTP is expired
        if (Date.now() > user.otpExpires) {
            // Clear expired OTP
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return { isValid: false, message: 'OTP expired' };
        }

        // Compare stored OTP with the provided OTP
        if (user.otp === otp) {
            // Clear the OTP fields after successful validation
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return { isValid: true };
        } else {
            return { isValid: false, message: 'Invalid OTP' };
        }
    } catch (error) {
        console.error('Error in validateOtp:', error.message);
        return { isValid: false, message: 'Server error' };
    }
};

module.exports = { sendOtp, validateOtp };
