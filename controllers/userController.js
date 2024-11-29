import mongoose from "mongoose";
import UserModel from "../schemas/user.js";
import crypto from "crypto";  
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL, // Your email from the .env file
    pass: process.env.APP_PASSWORD, // Your app password from the .env file
  },
});


// signup user
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, employeeID, position, gender, role, supervisorId } = req.body;

    // Check if user exists
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword, 
      employeeID,
      position,
      gender,
      role,
      supervisorId,
      isAdmin: role === "Admin",
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   // Compare the password with the hashed password in the database
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
     return res.status(401).json({ message: "Invalid credentials" });
   }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET_KEY, 
      { expiresIn: "1h" } 
    );

    // Respond with token and user info
    res.status(200).json({
      message: "Sign-in successful",
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


  

// add user

const AddUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, telephone, employeeID, position, gender, role } = req.body;

    // Create a random password (you can enhance this for better security)
    const password = crypto.randomBytes(8).toString("hex");

    console.log( `Creating user with email: ${ email }` );
    
       // Hash the password before saving it
       const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      telephone,
      employeeID,
      position,
      gender,
      role,
      password:hashedPassword,
      isAdmin: role === "admin" ? true : false,
      isActive: true,
    });

    // Save the user
    await newUser.save();

    console.log(`User created successfully: ${email}`);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL, 
        pass: process.env.APP_PASSWORD, 
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.USER_EMAIL, // Sender email
      to: email,
      subject: "Your Account Details",
      text: `Hello ${firstName},\n\nYour account has been created. Please use the following credentials to log in:\n\nEmail: ${email}\nPassword: ${password}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("Email sent: " + info.response);
    });

    res.json({ message: "User created successfully, and credentials sent to email." });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Internal server error", error: error.message });
  }
};
  
//  forget password
const ForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    console.log(`Forgot password request for email: ${email}`);

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log(`Generated reset token for user: ${email}`);

    // Save the reset token and its expiration in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Log the token to confirm it was saved
    console.log(`Saved reset token for user: ${email}, Token: ${resetToken}`);

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Hello ${user.firstName},\n\nWe received a request to reset your password. Please use the following link to reset your password:\n\n${process.env.FRONTEND_URL}/reset-password/${resetToken}\n\nIf you did not request this, please ignore this email.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("Password reset email sent: " + info.response);
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
  

//   request  password change
const RequestChangePassword = async (req, res, next) => {
    try {
      const { email, oldPassword, newPassword } = req.body;
      console.log(`Password change requested for email: ${email}`);
  
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.password !== oldPassword) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
  
      // Update password
      user.password = newPassword;
      await user.save();
  
      console.log(`Password changed for user: ${email}`);
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error(error);
      return res.json({ message: "Internal server error", error: error.message });
    }
  };
  

//   reset password

const ResetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    console.log(`Reset password request for token: ${resetToken}`);

    // Find the user with the reset token
    const user = await UserModel.findOne({ resetPasswordToken: resetToken });
    if (!user) {
      return res.status(404).json({ message: "Invalid or expired reset token" });
    }

    // Check if the token has expired (1 hour expiration in this example)
    const currentTime = Date.now();
    if (currentTime > user.resetPasswordExpires) {
      return res.status(400).json({ message: "Reset token has expired" });
    }

     // Hash the new password
     const hashedPassword = await bcrypt.hash(newPassword, 10);

     // Save the hashed password and clear the reset token
     user.password = hashedPassword;
     user.resetToken = undefined;
     user.resetTokenExpiry = undefined;
     await user.save();

    console.log(`Password reset successful for user: ${user.email}`);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
  
// Update information
  const UpdateAccountInfo = async (req, res, next) => {
    try {
      const { email, firstName, lastName, telephone, position, role } = req.body;
  
      console.log(`Updating account information for email: ${email}`);
  
      // Find the user
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update user information
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (telephone) user.telephone = telephone;
      if (position) user.position = position;
      if (role) user.role = role;
  
      await user.save();
  
      console.log(`User info updated successfully for email: ${email}`);
  
      res.json({ message: "User account info updated successfully", user });
    } catch (error) {
      console.error(error);
      return res.json({ message: "Internal server error", error: error.message });
    }
  };
  


//   delete account
  const DeleteAccount = async (req, res, next) => {
    try {
      const { email } = req.body;
  
      console.log(`Deleting account for email: ${email}`);
  
      // Find the user
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // You could add an authorization check to see if the requester is an admin
      // For example: if (!req.user.isAdmin) { return res.status(403).json({ message: "Not authorized" }); }
  
      // Delete the user
      await user.remove();
  
      console.log(`User account deleted successfully for email: ${email}`);
  
      res.json({ message: "User account deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.json({ message: "Internal server error", error: error.message });
    }
  };
  

const ToggleSetAdmin = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne( { email } );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isAdmin = !user.isAdmin;
        await user.save();
        res.json({ message: "User admin status toggled successfully" });
  } catch (error) {
    return res.json({ message: "Internal server error", error: error.message });
  }
};

const ToggleIsActive = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne( { email } );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isActive = !user.isActive
        await user.save();
        res.json({ message: "User status toggled successfully" });
  } catch (error) {
    return res.json({ message: "Internal server error", error: error.message });
  }
};

export default { signin, signup, AddUser, ForgotPassword, RequestChangePassword, ResetPassword, UpdateAccountInfo, DeleteAccount, ToggleSetAdmin, ToggleIsActive };

