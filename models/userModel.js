import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: null }, // Make password optional
  role: { 
    type: String, 
    enum: ['admin', 'Operations Manager', 'project Director', "Finance Manager"], 
    required: true 
  },
  isVerified: { type: Boolean, default: false },
  resetToken: String,
  resetTokenExpire: Date,
  // New fields
  passwordSetupToken: String,
  passwordSetupTokenExpire: Date,
  accountStatus: {
    type: String,
    enum: ['Pending', 'Active', 'Suspended'],
    default: 'Pending'
  }
});

// Modify the pre-save hook
userSchema.pre('save', async function (next) {
  // Only hash the password if it is modified and not null
  if (this.isModified('password') && this.password !== null) {
    this.password = await bcrypt.hash(this.password, 12);
    // When password is set, change status to Active
    this.accountStatus = 'Active';
    // Clear the setup token
    this.passwordSetupToken = undefined;
    this.passwordSetupTokenExpire = undefined;
  }
  next();
});

// Method to compare the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Optional: Add a method to generate password setup token
userSchema.methods.generatePasswordSetupToken = function() {
  this.passwordSetupToken = crypto.randomBytes(32).toString('hex');
  this.passwordSetupTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return this.passwordSetupToken;
};

const userModel = mongoose.model('User', userSchema);

export default userModel;