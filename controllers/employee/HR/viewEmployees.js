import Users from "../../../models/employee/usersSchema";


/**
 * This Function reterieves all Users on behalf of HR
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllEmployees = async (req, res) => {
    try {

      const employee = await Users.find({ role: "Employee" });
      if (!employee || employee.length <= 0) {
        return res.json({ message: "No Employee found " });
      }
  
      return res.status(202).json({ message: "Employee found", employees: employee });
    } catch (error) {
      return res.json({ message: "Internal server error", error: error.message });
    }
  };


  /**
   * GET FUNCTION TO GET EPLOYEE BY ID
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await Users.findOne({ _id: id });
      if (!employee || id == null || id == "undefined") {
        return res.json({ message: "No User found or check employee id" });
      }
  
      return res.status(202).json({ message: "Employee found", employee });
    } catch (error) {
      return res.json({ message: "Internal server error", error: error.message });
    }
  };
  


  export default {getAllEmployees, getUserById}