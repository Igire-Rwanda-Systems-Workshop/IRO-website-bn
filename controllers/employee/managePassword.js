import Users from "../..//models/employee/usersSchema.js";
import main from "../../utils/email/sendmail.js";
import Token from "../../middleware/employee/JWT.js";
import bcrypt from "bcrypt"

/**
 * function to send reset password link to the email
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.send({ message: "Email is required" });
    }

    const userExist = await Users.findOne({ email });

    if (!userExist) {
      return res.send({ message: "User not exist" });
    }
    const token = await Token.generateToken({email});
    // Email structure Logic
    let to = email;
    let text = `Thank you for requesting to reset password, <br /> Click this button to reset your password, <a style="background-color: 'blue'" target='_blank' href='${process.env.BKEND_URL}/reset-password/${token}'>Reset Password</a> <br /> if the button not works click this link <br /> ${process.env.BKEND_URL}/reset-password/${token}`;
    let bestregards = "Best regards";
    let todo =""
    await main(todo, bestregards, text, to);

    return res.status(200).json({ message: "Password reset link was sent" });
  } catch (error) {
    return res.status(500).json({ message: "Some thing went wrong",error:error.message });
  }
};

/**
 * 
 */
const updatePassword = async (req, res) => {
    try {
        const {token} = req.params
        const {password} = req.body

        if(!token){
            return res.send({ message: "Token not found" });  
        }

        const decoded = await Token.decodeToken(token)
        const email = decoded.email

        const isUserExist = await Users.findOne({email})
        if(!email){
            return res.send({ message: "User not found" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        isUserExist.password = hashedPassword
        isUserExist.save()

        return res.status(200).json({message:"Password updated success full"})

    } catch (error) {
        return res.status(500).json({ message: "Some thing went wrong",error:error.message });
    }
}

export default { forgotPassword , updatePassword};
