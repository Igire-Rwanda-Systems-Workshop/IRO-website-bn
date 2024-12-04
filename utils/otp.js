import crypto from 'crypto';

const otpService = {};

// Function to generate a random OTP
// By default, we'll generate a 6-digit numeric OTP, but you can change this based on your needs.
otpService.generateOTP = () => {
    // Generate a random 6-digit OTP (numeric only)
    const otp = Math.floor(100000 + Math.random() * 900000); 
    return otp.toString(); // Return as string to handle leading zeros
};

// Function to verify the OTP
// It checks whether the OTP is valid (not expired) and matches the stored OTP.
otpService.verifyOTP = (otp, storedOTP) => {
    if (otp === storedOTP) {
        return true; // OTP matches
    } else {
        return false; // OTP doesn't match
    }
};

// Optional: Function to generate a random alphanumeric OTP (if you need letters as well)
otpService.generateAlphanumericOTP = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
};

export default otpService;
