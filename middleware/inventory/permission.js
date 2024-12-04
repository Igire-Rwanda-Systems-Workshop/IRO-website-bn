import jwt from 'jsonwebtoken'; // Import the JSON Web Token library

// Higher-order middleware function
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    console.log('Authorization header:', req.headers.authorization); 
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      // Decode the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      console.log('Decoded token:', decoded); 
      const { role } = decoded; 

      if (role !== requiredRole) {
        return res.status(403).json({ message: `Access denied. Only ${requiredRole}s can access this route.` });
      }

      // Attach decoded information to the request object for further use
      req.user = decoded;

      next(); 
    } catch (error) {
      return res.status(400).json({ message: 'Invalid token.' });
    }
  };
};

export default checkRole;
