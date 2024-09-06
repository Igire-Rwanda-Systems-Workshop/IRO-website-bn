const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/auth');
const { v4: uuidv4 } = require('uuid');
const Token = require('../models/Token');
const sendEmail = require('../utils/sendEmail');
const { Console } = require('console');

// Signup
exports.signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
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
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Debugging: Output provided password and stored hashed password
        console.log('Provided password:', password);
        console.log('Provided hashed password:', bcrypt.compareSync(password,user.password));
        console.log('Stored hashed password:', user.password);

        // Compare provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        // Debugging: Check if the password matches
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        // Generate JWT token (consistent with resetPassword function)
        const authToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ msg: 'Login successful', token: authToken });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ msg: 'Server error' });
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


exports.resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword, confirmPassword } = req.body;

        // Validate request parameters
        if (!email || !token || !newPassword || !confirmPassword) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ msg: 'Passwords do not match' });
        }

        // Hash the token provided by the user for verification
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by email and reset token, and ensure it hasn’t expired
        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token, or email mismatch' });
        }

        // Generate salt and hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password and clear reset token fields
        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    password: hashedPassword,
                    resetPasswordToken: null,
                    resetPasswordExpires: null
                }
            }
        );

        // Optionally, you can auto-login the user after the password reset by generating a JWT token
        const authToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with success message and JWT token
        res.status(200).json({ msg: 'Password updated successfully', token: authToken });
    } catch (err) {
        console.error('Error during password update:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

