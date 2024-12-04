import jwt from 'jsonwebtoken';
import UserModel from '../../models/employee/user';

export const authenticate = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find the user based on the token's payload
    const user = await UserModel.findOne({ _id: decoded.id, email: decoded.email });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed. User not found." });
    }

    // Attach user information to the request object for further use
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Pass control to the next middleware
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};
