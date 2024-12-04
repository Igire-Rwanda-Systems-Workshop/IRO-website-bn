import Users from "../../../models/employee/usersSchema.js";
import Leave from "../../../models/employee/leaves.js";
import main from "../../../utils/email/sendmail.js";

/**
 * Function to Update Employees
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { supervisorId, firstName, lastName, email, position, gender, telephone } =
      req.body;

    const dataToUpdate = await Users.findByIdAndUpdate(
      { _id: id },
      { supervisorId, firstName, lastName, email, position, gender, telephone }
    );
    if(!dataToUpdate){
      return res.status(300).json({message:"Employee not updated"})
    }

    // Email structure Logic
    let to = email;
    let text = `Dear ${lastName} !, <br /><br /> This is to say that your leave request account is <b>Updated. </b><br />Username: <b>${email}</b><br /> `;
    let bestregards = "Best regards";
    let empt = ""
    await main(empt, bestregards, text, to);

    return res.status(200).json({message:"Success user Updated"})
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Function to delete Employee(User)
 * @param {*} req
 * @param {*} res
 */
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const userToDelete = await Users.delete({ _id: id });
    if (!userToDelete) {
      return res.status({ message: "User not found" });
    }
    return res.status({ message: "User deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


/**
 * function to update HR
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateHr = async (req, res) => {
  try {
    const { hrId } = req.params;
    const { firstName, lastName, email } = req.body;
    const hrToUpdate = await HumanRecource.findByIdAndUpdate(
      { _id: hrId },
      { firstName, lastName, email }
    );
    if (!hrToUpdate) {
      return res
        .status(500)
        .json({ message: "Update failures", error: error.message });
    }

    // Email logic
    const to = email;
    const text = `
            Dear HR ${lastName},<br /><br />
            This email says that your account have updated. the following is the updates <br />${firstName} ${lastName}</br> ${email}<br /><br />
        `;
    const bestregards = "Best regards";
    const emai = ""; // Add sender email
    await main(emai, bestregards, text, to);

    return res
      .status(200)
      .json({ message: "Human Recource updated", hrToUpdate });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default {
  updateEmployee,
  deleteEmployee,
  updateHr,
};