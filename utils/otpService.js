const crypto = require('crypto');

// Generate OTP
exports.generateOTP = () => {
  return crypto.randomBytes(3).toString('hex'); // Generates a 6-digit OTP
};

// Verify OTP
exports.verifyOTP = (inputOTP, storedOTP) => {
  return inputOTP === storedOTP;
};
