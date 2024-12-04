import bcrypt from "bcrypt";
import Token from "../../../middleware/employee/JWT.js";
import main from "../../../utils/email/sendmail.js";
import Users from "../../../models/employee/usersSchema.js";

/**
 *
 * Function for registering HR
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns
 */
const register = async (req, res) => {
  try {
    const {
      supervisorId,
      firstName,
      lastName,
      email,
      position,
      gender,
      telephone,
      password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const isUserExist = await Users.find({ email });
    if (isUserExist.length >= 1) {
      return res.json({ message: "User arleady exist" });
    } else {
      const register = await Users.create({
        supervisorId,
        firstName,
        lastName,
        email,
        position,
        gender,
        telephone,
        password: hashedPassword,
      });
      if (!register) {
        return res.status(300).json({ message: "register error" });
      }

      // TEXT FOR EMAIL
      let to = email;
      let text = `Hello ${lastName} !, your Leave Request account have been created success full <br/> Your userName and pasword  are namely respectively below:`;
      if (register) {
        await main(email, password, text, to);
      }
      return res
        .status(202)
        .json({ message: "Success register", registered: register });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal sever error", error: error.message });
  }
};

/**
 * Login fuction using email and password
 * and generate token for login
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const login = await Users.findOne({ email });

    if(!login){
      return res.status(404).json({message:"Invalid username"})
    }

    const credentials = {
      lastname: login.lastName,
      email: login.email,
      id: login._id,
      role: login.role
    };

    if(login.status != "Active"){
      return res.status(300).json({message:"Your account is Locked. Please contact your Admin"})
    }

    if (login) {
      const token = await Token.generateToken(credentials);

      const passwordMatch = await bcrypt.compare(password, login.password);
      if (passwordMatch)
        return res
          .status(200)
          .json({ message: "Login Successfull", user: login, token });
    }
    return res.status(200).json({ message: "Incorect Username or Password" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};



/**
 * Funtion to make user admin
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const makeUserAdmin = async (req, res) => {
  try{
    const {id} = req.params
    const userToMakeAdmin = await Users.findByIdAndUpdate({_id : id}, {role: "Admin"})
    if(!userToMakeAdmin){
      return res.json({message:"User not made admin"})
    }
    return res.status(200).json({message:"Success full user made as an admin"})
  }catch(error){
    return res.status(500).json({message:"Internal server error", error: error.message})
  }
}


/**
 * Funtion to make user Supervisor
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const makeSupervisor = async (req, res) => {
  try{
    const {id} = req.params
    const userToMakeSupervisor = await Users.findByIdAndUpdate({_id : id}, {role: "Supervisor"})
    if(!userToMakeSupervisor){
      return res.json({message:"User not made supervisor"})
    }
    return res.status(200).json({message:"Success full changed to Supervisor"})
  }catch(error){
    return res.status(500).json({message:"Internal server error", error: error.message})
  }
}

/**
 * Funtion to revoke user admin Permission
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const revokePrevilage = async (req, res) => {
  try{
    const {id} = req.params
    const userToRevoke = await Users.findByIdAndUpdate({_id : id}, {role: "Employee"})
    if(!userToRevoke){
      return res.json({message:"Permission not revoked"})
    }
    return res.status(200).json({message:"Success Permission revoked"})
  }catch(error){
    return res.status(500).json({message:"Internal server error", error: error.message})
  }
}



/**
 * Funtion to Lock Account
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const lockAccount = async (req, res) => {
  try{
    const {id} = req.params
    const lock = await Users.findByIdAndUpdate({_id : id}, {status: "Locked"})
    if(!lock){
      return res.json({message:"Account Not locked"})
    }
    return res.status(200).json({message:"Success accound Locked"})
  }catch(error){
    return res.status(500).json({message:"Internal server error", error: error.message})
  }
}

/**
 * Funtion to UNLOCK Lock Account
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const unLockAccount = async (req, res) => {
  try{
    const {id} = req.params
    const unLock = await Users.findByIdAndUpdate({_id : id}, {status: "Active"})
    if(!unLock){
      return res.json({message:"Account Not Activated"})
    }
    return res.status(200).json({message:"Success accound Activated"})
  }catch(error){
    return res.status(500).json({message:"Internal server error", error: error.message})
  }
}



// EXPORTING FUNCTION
export default {
  register,
  login,
  makeUserAdmin,
  makeSupervisor,
  revokePrevilage,
  lockAccount,
  unLockAccount
};
