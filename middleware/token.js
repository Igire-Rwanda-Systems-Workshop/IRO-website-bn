import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  console.log("Generating access token ===> ", user);
  
  return jwt.sign(
    { _id: user.id, role: user.role }, 
    process.env.JWT_SECRET,
    { expiresIn: '1h' } )
};

export const generateRefreshToken = (user) => {
  console.log("iddddddd", user._id)
  return jwt.sign(
    { _id: user._id, role: user.role }, 
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } 
  );
};
