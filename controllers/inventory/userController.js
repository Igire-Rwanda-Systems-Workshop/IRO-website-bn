
import  bcrypt from  'bcryptjs';
import jwt  from 'jsonwebtoken';
import crypto from 'crypto';
import emailServices  from '../../utils/emailServices.js';
import sendEmail from '../../utils/emailUtils.js';
import otpService  from '../../utils/otp.js';
import userModel from "../../models/inventory/userModel.js";
import tokenModel from "../../models/inventory/tokenModel.js";
import {generateAccessToken} from '../../middleware/inventory/token.js';


let otpStorage = {};

// Admin Signup


const adminSignup = async (req, res) => {
    const { name, email, password } = req.body;
    
    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
  
    try {
      // Check if email is already in use
      const existingUser = await userModel.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already exists' });
      }
  
      // Hash password
      // const hashedPassword = bcrypt.hashSync(password, 10);

      const user = {
        name,
        email,
        password,
        role: 'admin',
      }
      
  
      // Create admin user
      const newAdmin = new userModel(user);
  
      await newAdmin.save();
      console.log('New Admin Created:', newAdmin);
      // Generate OTP
      const otp = otpService.generateOTP();
      otpStorage[email] = otp;
      console.log('Generated OTP:', otp);
      console.log('OTP Storage:', otpStorage);
  
      // Send OTP to email
      await emailServices.sendOTP(email, otp);
  
      // Generate a JWT
      const token = generateAccessToken(
        { id: newAdmin._id, role: newAdmin.role },
        process.env.JWT_SECRET,
        '1d'
      );
  
      res.status(201).json({
        message: 'Signup successful. Check your email for the OTP.',
        token,
      });
    } catch (error) {
      console.error('Error during admin signup:', error); // Log error for debugging
      res.status(500).json({ message: 'Signup failed', error: error.message });
    }
  };
  



const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const storedOTP = otpStorage[email];

    if (otpService.verifyOTP(otp, storedOTP)) {
        await userModel.findOneAndUpdate({ email }, { isVerified: true });
        delete otpStorage[email];
        res.json({ message: 'Account verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
};


/// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Normalize email
    const normalizedEmail = email;

    // Find user in database
    const user = await userModel.findOne({ email: normalizedEmail });
    console.log('User:', user, normalizedEmail);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or passwordo' });
    }

    // Compare passwords

    console.log('Compare passwords', password, user.password);
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    console.log('Compare passwords', isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid passwordp' });
    }
console.log("usersssssss",user);

    // Generate JWT
    const token = generateAccessToken(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      '1d'
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create User (by Admin)

const createUser = async (req, res) => {
  console.log('createUser function invoked');
  try {
    // Extract the role from the token (set by the checkRole middleware)
    const { role: userRole } = req.user;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can create users.' });
    }

    // Extract data from the request body
    const { name, email, role } = req.body;
    const plainPassword = Math.random().toString(36).slice(-8); // Generate a random password

    // Create a new user with the plain password (hashed in the model pre-save hook)
    const newUser = new userModel({ name, email, password: plainPassword, role });
    await newUser.save();

    // Log credentials (for debugging purposes only)
    console.log(`Credentials sent to user: 
      Email: ${email}, 
      Password: ${plainPassword}, 
      Role: ${role}`);

    // Send credentials via email
    await emailServices.sendCredentials(email, plainPassword, role);

    res.status(201).json({ 
      message: 'User created and credentials sent',
      user: newUser, // Be cautious: this will include the hashed password
    });
  } catch (error) {
    console.error('Error creating user:', error); // Debugging log
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(id, { name, email, role ,isVerified:true }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully', updatedUser });
};

// Delete User (by Admin)
const deleteUser = async (req, res) => {
    const { id } = req.params;

    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
};


  // Fetch all users from the database
const getAll = async(req,res)=>{
  const users = await userModel.find();
  res.json(users);
}
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpire = Date.now() + 3600000; // Token expires in 1 hour

        // Save user with new reset token
        await user.save();

        // Log the values for debugging
        console.log('Reset Token:', resetToken);
        console.log('Token Expiry:', user.resetTokenExpire);

        // Send the reset token to the user's email
        const resetUrl = `http://localhost:5000/reset-password?token=${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset',
            text: `Click here to reset your password: ${resetUrl}`
        });

        res.json({ message: 'Reset token sent to your email' });
    } catch (error) {
        console.error('Error in forgotPassword:', error.message);
        res.status(500).json({ message: 'Error requesting password reset', error: error.message });
    }
};



// Reset password (for both Admin and Users)
// const resetPassword = async (req, res) => {
//     const { token, newPassword, confirmNewPassword } = req.body;

//     // Check if the passwords match
//     if (newPassword !== confirmNewPassword) {
//         return res.status(400).json({ message: 'Passwords do not match' });
//     }

//     // Find user by reset token
//     const user = await userModel.findOne({
//         resetToken: token,
//         resetTokenExpire: { $gt: Date.now() }, // Check if token is still valid
//     });

//     if (!user) {
//         return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     // Hash the new password
//     user.password = newPassword;
//     user.resetToken = null;
//     user.resetTokenExpire = null; 
//     await user.save();

//     res.json({ message: 'Password has been reset successfully' });
// };
const changePassword = async (req, res) => {
  console.log("ffdd",req.user._id);
  
  try {
    // Extract the user ID from the token (assumes authentication middleware is used)
    const userId = req.user._id;
    console.log(userId);
    
    // Extract current and new passwords from the request body
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    // Fetch the user from the database
    const user = await userModel.findById(userId);
    console.log(user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify the current password
    const isMatch = await user.comparePassword(currentPassword); // Assuming `comparePassword` is a method in your user schema
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // Update the password
    user.password = newPassword; 
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update password', error: error.message });
  }
};

const userController = {
    adminSignup,
    verifyOTP,
    login,
    getAll,
    changePassword,
    createUser,
    updateUser,
    deleteUser,
    forgotPassword,
    
}

export default userController;