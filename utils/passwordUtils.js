const bcrypt = require('bcrypt');

// Hash a password
exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Compare passwords
exports.comparePassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};
