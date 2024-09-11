const nodemailer = require('nodemailer');

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP to admin
exports.sendOTP = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Account',
    text: `Your OTP for verification is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
};

// Send user credentials
exports.sendCredentials = (email, password, role) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Login Credentials',
    text: `You have been assigned the role of ${role}. Your login password is: ${password}`,
  };

  return transporter.sendMail(mailOptions);
};

// Send password reset token
exports.sendResetToken = (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `Here is your password reset token: ${token}`,
  };

  return transporter.sendMail(mailOptions);
};
