import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 *
 * Function for generating token that holds user credentials
 * username (email) and password
 *
 * @param {Parameters} users
 * @returns {string: token}
 */
const generateToken = async (users) => {
  try {
    let token = jwt.sign(users, process.env.TOKEN_KEY, { expiresIn: "1h" });
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

const decodeToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    if(!decodedToken){
      throw new Error(JSON.stringify({message:"Ivalid Token", error: error.message})) 
    }
    if(decodedToken === null || decodedToken === "undefined" || decodedToken == undefined){
      throw new Error(JSON.stringify({message:"Token is required", error: error.message}))
    }
    return (decodedToken)
  } catch (error) {
    throw new Error(JSON.stringify({
      message: "Failured to decode token",
      error: error.message,
    }));
  }
};

export default {generateToken, decodeToken};
