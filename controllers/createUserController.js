const User = require('../models/createUser');
const sendEmail = require('../utils/sendEmail');
const nodemailer = require('nodemailer');

// Create User
exports.createUser = async (req, res) => {
    const { names, email, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            names,
            email,
            password,
            role
        });

        await user.save();
        

        try {
            // const { email, subject, text } = req.body;
            // Create a transporter using your email service
            let transporter = nodemailer.createTransport({
                service: 'Gmail', // You can use other email services like Outlook, Yahoo, etc.
                auth: {
                    user: 'angeiracyadukunda@gmail.com', // Your email address
                    pass: 'pepb fftm iqlk fcxa', // Your email password or app-specific password if 2FA is enabled
                },
            });
    
            // Define the email options
            let mailOptions = {
                
                from: 'angeiracyadukunda@gmail.com', // Sender address
                to:`${email}`, // List of recipients
                subject: "your account information ", // Subject line
                 text: `Hello ${names},  your email and password is ${email} , ${password}`
            };
    
            // Send the email
            // let info = await transporter.sendMail(mailOptions);
            // // Success response
            // res.status(200).json({ message: 'Email sent successfully',  info });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Failed to send email', error });
        }



        res.status(201).json({ msg: 'User created successfully', user });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ msg: 'Server error' });
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
            user.password = password; // Will be hashed by pre-save hook
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



// const sendByEmail = async (req, res) => {
//     try {
//         // const { email, subject, text } = req.body;
//         // Create a transporter using your email service
//         let transporter = nodemailer.createTransport({
//             service: 'Gmail', // You can use other email services like Outlook, Yahoo, etc.
//             auth: {
//                 user: 'angeiracyadukunda@gmail.com', // Your email address
//                 pass: 'pepb fftm iqlk fcxa', // Your email password or app-specific password if 2FA is enabled
//             },
//         });

//         // Define the email options
//         let mailOptions = {
            
//             from: 'angeiracyadukunda@gmail.com', // Sender address
//             to:"angeiracya@gmail.com", // List of recipients
//             subject: "your account information ", // Subject line
//              text: `Hello ${user.names}, your password is ${user.password}`
//         };

//         // Send the email
//         let info = await transporter.sendMail(mailOptions);
//         // Success response
//         res.status(200).json({ message: 'Email sent successfully',  info });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({ message: 'Failed to send email', error });
//     }
// };