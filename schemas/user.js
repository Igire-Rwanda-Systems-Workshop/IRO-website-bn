import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true, 
  },
  telephone: { type: String },
  supervisorId: { type: Schema.Types.ObjectId, ref: "User" },
  employeeID: { type: String, required: true },
  position: { type: String, required: true },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  role: {
    type: String,
    required: true,
    enum: ["Employee", "Supervisor", "Admin"],
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", UserSchema);

export default User;
