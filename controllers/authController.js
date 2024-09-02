const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const crypto = require('crypto');

// Send OTP via email
const sendOtp = async (email, otp) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
            html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('OTP sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending OTP email: ', error);
        throw new Error('Failed to send OTP email');
    }
};

exports.signup = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(100000, 999999);
        const newUserId = new mongoose.Types.ObjectId();

        user = new User({
            userId: newUserId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpires: Date.now() + 15 * 60 * 1000 // OTP valid for 15 minutes
        });

        await user.save();
        await sendOtp(email, otp);

        res.status(200).json({ msg: 'Account created! OTP sent to your email use it to signin.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999);
        user.otp = otp;
        user.otpExpires = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
        await user.save();

        // Send OTP to user's email
        await sendOtp(email, otp);

        res.status(200).json({ msg: 'OTP sent to email. Please verify to complete sign-in.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.verifyOtpAndSignin = async (req, res) => {
    const { email, otp } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const otp = crypto.randomInt(100000, 999999);
        user.otp = otp;
        user.otpExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendOtp(email, otp);

        res.status(200).json({ msg: 'OTP sent to email' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ msg: 'Password reset successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.authenticateUser = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
