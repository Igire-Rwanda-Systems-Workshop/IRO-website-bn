import readable from "readable-stream";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import emailServices from "../utils/emailService.js";
import sendEmail from "../utils/emailUtils.js";
import otpService from "../utils/otpService.js";
import userModel from "../models/userModel.js";
import tokenModel from "../models/Token.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let otpStorage = {};

const adminSignup = async (req, res) => {
  const { name, email, password } = req.body;

  // Generate OTP
  const otp = otpService.generateOTP();

  // Store OTP in otpStorage
  otpStorage[email] = { otp, otpExpiry: Date.now() + 10 * 60 * 1000 }; // OTP valid for 10 minutes

  console.log("Generated OTP:", otp); // For debugging
  console.log("OTP Storage after signup:", otpStorage); // For debugging

  const newAdmin = new userModel({ name, email, password, role: 'admin' });

  try {
      // Save the new admin user
      await newAdmin.save();

      // Send OTP to email
      await emailServices.sendOTP(email, otp);

      res.status(201).json({ message: 'Signup successful, check your email for OTP' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Signup failed' });
  }
};

//  verify otp for all users admin and regular users

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const storedOTPData = otpStorage[email];

  if (!storedOTPData) {
      return res.status(400).json({ message: "OTP not found" });
  }

  const { otp: storedOTP, otpExpiry } = storedOTPData;

  if (Date.now() > otpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
  }

  if (otpService.verifyOTP(otp, storedOTP)) {
      // Mark the user as verified
      await userModel.findOneAndUpdate({ email }, { isVerified: true });
      delete otpStorage[email];
      res.json({ message: "Account verified successfully" });
  } else {
      res.status(400).json({ message: "Invalid OTP" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await userModel.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      if (!user.isVerified) {
          return res.status(403).json({ message: "Please verify your account before logging in" });
      }

      const token = jwt.sign(
          { id: user._id, role: user.role, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
      );

      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const newToken = new tokenModel({ token, user: user._id, expirationDate });
      await newToken.save();

      return res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Login failed" });
  }
};


// Create User (by Admin)
const userSignup = async (req, res) => {
  const { name, email, role } = req.body;

  // Generate OTP and random password
  const otp = otpService.generateOTP();
  const randomPassword = Math.random().toString(36).slice(-8); // Generate random password

  // Store OTP in otpStorage
  otpStorage[email] = { otp, otpExpiry: Date.now() + 10 * 60 * 1000 }; // OTP valid for 10 minutes

  console.log("Generated OTP:", otp); // For debugging
  console.log("OTP Storage after signup:", otpStorage); // For debugging

  const newUser = new userModel({ name, email, password: randomPassword, role, isVerified: false });

  try {
      // Save the new user
      await newUser.save();

      // Send OTP and random password to email
    await emailServices.sendOTP( email, otp ); // Sends OTP
      // Send email with OTP and credentials
      await emailServices.sendCredentials(email, randomPassword, role,otp); 

    res.status( 201 ).json( {
      message: 'Signup successful, check your email for OTP and password' ,
      data: newUser  
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Signup failed' });
  }
};


// Update User (by Admin)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const updatedUser = await userModel.findByIdAndUpdate(
    id,
    { name, email, role, isVerified: true },
    { new: true }
  );
  if (!updatedUser) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User updated successfully", updatedUser });
};

// Delete User (by Admin)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  const deletedUser = await userModel.findByIdAndDelete(id);
  if (!deletedUser) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted successfully" });
};

// get all users
const getAllUsers = async (req, res) => {

  const users = await userModel.find({});
  res.json({
    
    data:users
  });
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 3600000; // Token expires in 1 hour

    // Save user with new reset token
    await user.save();

    // Log the values for debugging
    console.log("Reset Token:", resetToken);
    console.log("Token Expiry:", user.resetTokenExpire);

    // Send the reset token to the user's email
    const resetUrl = `http://localhost:5000/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: `Click here to reset your password: ${resetUrl}`,
    });

    res.json({ message: "Reset token sent to your email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res
      .status(500)
      .json({
        message: "Error requesting password reset",
        error: error.message,
      });
  }
};

// Reset password (for both Admin and Users)
const resetPassword = async (req, res) => {
  const { token, newPassword, confirmNewPassword } = req.body;

  // Check if the passwords match
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Find user by reset token
  const user = await userModel.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }, // Check if token is still valid
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Hash the new password
  user.password = newPassword;
  user.resetToken = null;
  user.resetTokenExpire = null;
  await user.save();

  res.json({ message: "Password has been reset successfully" });
};

const userController = {
  adminSignup,
  verifyOTP,
  login,
  userSignup,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  
};

export default userController;
