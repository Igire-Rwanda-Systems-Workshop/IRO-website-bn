import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Decoded token:', decoded); 
    req.user = decoded;

    next();
  } catch (err) {
    console.error('Authentication error:', err.message); 
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authenticate;
