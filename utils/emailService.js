import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config()

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP to user/admin
const sendOTP = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "angeiracyadukunda@gmail.com", // Use the recipient's email
    subject: 'Verify Your Account',
    text: `Your OTP for verification is: ${otp}. Please enter this OTP to verify your account.`,
  };

  return transporter.sendMail(mailOptions);
};

// Send credentials (password) and OTP to the user
const sendCredentials = async ( email, password, role, otp ) =>
  
{
  console.log("our otp is", otp)
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "angeiracyadukunda@gmail.com", 
    subject: 'Your Login Credentials and OTP for Verification',
    text: `You have been assigned the role of ${role}. Your login password is: ${password}. To verify your account, use the following OTP: ${otp}.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};


// Send password reset token
const sendResetToken = (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "angeiracyadukunda@gmail.com", 
    subject: 'Password Reset Request',
    text: `Here is your password reset token: ${token}. Please use this token to reset your password.`,
  };

  return transporter.sendMail(mailOptions);
};

// Export the email services
const emailServices = {
  sendOTP,
  sendCredentials,
  sendResetToken,
}

export default emailServices;
