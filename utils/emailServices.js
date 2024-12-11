import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
    auth: {
        user: process.env.EMAIL_USER, // Your email address (must be a valid Gmail or other service)
        pass: process.env.EMAIL_PASS, // Your email password (or an App password for Gmail)
    },
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    tls: {
      servername: 'smtp.gmail.com',
    },
});

// Function to send OTP email
const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // sender address
            to: email, // recipient's email address
            subject: 'Your OTP for Admin Verification', // Subject line
            text: `Your OTP is ${otp}. Please use it to verify your email.`, // Plain text body
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
};

// Function to send credentials email
const sendCredentials = async (email, password, role) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // sender address
            to: email, // recipient's email address
            subject: 'Your Account Credentials', // Subject line
            text: `Welcome to the platform! Your account has been created. Your password is: ${password}. Your role is: ${role}.`, // Plain text body
        };

        await transporter.sendMail(mailOptions);
        console.log(`Credentials sent to ${email}`);
    } catch (error) {
        console.error('Error sending credentials:', error);
    }
};

const sendPasswordSetupEmail= async (email, setupLink) => {
    await transporter.sendMail({
      from: 'ntirukelly@gmail.com',
      to: email,
      subject: 'Set Up Your Account Password',
      html: `
        <h1>Account Creation</h1>
        <p>Your account has been created. Please set up your password by clicking the link below:</p>
        <a href="${setupLink}">Set Up Password</a>
        <p>This link will expire in 24 hours.</p>
      `
    });
  }

export default {
    sendOTP,
    sendCredentials,
    sendPasswordSetupEmail
};
