const User = require('../models/createUser');
const sendEmail = require('../utils/sendEmail');
const nodemailer = require('nodemailer');

// Create User
exports.createUser = async (req, res) => {
    const { names, email, password, role } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user
        user = new User({
            names,
            email,
            password,
            role
        });

        await user.save();

        // Send email after user creation
        try {
            let transporter = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                    user: process.env.EMAIL_USER, 
                    pass: process.env.EMAIL_PASS, 
                },
            });

            // Define email options
            let mailOptions = {
                from: process.env.EMAIL_USER, // Sender address
                to:  "angeiracyadukunda@gmail.com", 
                subject: "Your Account Information", // Email subject
                text: `Hello ${names}, your email is ${email}, and your password is ${password}`,
            };

            // Send the email
            let info = await transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);

            // Send success response and exit function
            return res.status(201).json({ msg: 'User created and email sent successfully', user, info });

        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ msg: 'Failed to send email', error });
        }

    } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ msg: 'Server error' });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    const { names, email, password, role } = req.body;

    try {
        // Find user by ID and update
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update user fields
        user.names = names || user.names;
        user.email = email || user.email;
        if (password) {
            user.password = password; 
        }
        user.role = role || user.role;

        await user.save();

        res.status(200).json({ msg: 'User updated successfully', user });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        // Find user by ID and delete
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.deleteOne();

        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};