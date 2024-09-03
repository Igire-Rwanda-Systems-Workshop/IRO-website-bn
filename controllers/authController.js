const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const Token = require('../models/Token');
const sendEmail = require('../utils/sendEmail');

// Signup
exports.signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
      console.log (user);
        // Create user and generate a unique userId
        user = new User({ 
            firstName, 
            lastName, 
            email, 
            password,
            userId: uuidv4()  // Generate a unique userId
        });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
        await user.save();

        // Send OTP email
        await sendEmail(email, 'Verify Your Account', `Your OTP is ${otp}`);

        res.status(201).json({ msg: 'OTP sent to email' });
    } catch (err) {
        console.error("Error during signup:", err);  
        res.status(500).json({ msg: 'Server error' });
    }
};

// Verify Account
exports.verifyAccount = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        // Verify the user
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ msg: 'Account verified successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(400).json({ msg: 'Account not verified' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Forgot Password

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save reset token in the database
        user.resetPasswordToken = hashedToken;
        // user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; 
        
       
await user.save();

        // Send reset link
        const resetUrl = `${req.protocol}://${req.get('host')}/${user._id}/api/auth/reset-password/${hashedToken}`;
        const message = ` Dear ${user.firstName}, You are receiving this email because you requested a password reset. Please go to the following link to reset your password:\n\n ${resetUrl}`;

        await sendEmail(user.email, 'Password Reset Request', message);

        res.status(200).json({ msg: 'Password reset link sent to email' });
    } 

catch (err) {
        console.error('Error during password reset request:', err);
        res.
        
status(500).json({ msg: 'Server error' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    try {
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ msg: 'Passwords do not match' });
        }

        // Hash the token provided by the user
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by reset token and ensure it hasn’t expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);

        // Clear reset token fields
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ msg: 'Password reset successfully' });
    } catch (err) {
        console.error('Error during password reset:', err);
        res.status(500).json({ msg: 'Server error' });
    }
    

};
