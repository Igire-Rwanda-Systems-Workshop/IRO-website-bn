// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit numeric OTP
};

// Verify OTP
const verifyOTP = (inputOTP, storedOTP) => {
  return inputOTP === storedOTP;
};

const otpService = {
  generateOTP,
  verifyOTP,
};

export default otpService;
