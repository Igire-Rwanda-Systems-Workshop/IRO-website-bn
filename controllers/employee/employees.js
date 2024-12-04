import main from "../../utils/email/sendmail.js";
import Users from "../../models/employee/usersSchema.js";
import bcrypt from "bcrypt"
import Token from "../../middleware/employee/JWT.js"
import Leave from "../../models/employee/leaves.js";



/**
 * function to allow employee to cancel Leave request
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params; // leave request Id

    const token = req.headers.authorization.split(" ")[1];
    const tokenCredentials = await Token.decodeToken(token);

    const user = await Users.findOne({ email: tokenCredentials.email });
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    if (!id) {
      return res.status(400).json({ message: "Leave request ID is required" });
    }

    const leaveRequest = await Leave.findOne({ _id: id, userId: user._id });
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // if (leaveRequest.status !== "approved" || leaveRequest.hrStatus !== "approved" || leaveRequest.supervisorStatus !== "approved") {
    //   return res.status(400).json({ message: "Leave request must be fully approved to cancel" });
    // }

    const currentDate = new Date();
    if (currentDate < new Date(leaveRequest.startDate)) {
      // If the leave hasn't started yet
      await Leave.updateOne({ _id: leaveRequestId }, { status: "canceled" });
      return res.status(200).json({ message: "Leave request successfully canceled before starting" });
    } else if (currentDate <= new Date(leaveRequest.endDate)) {
      // If the leave is ongoing
      await Leave.updateOne(
        { _id: id },
        { status: "canceled", endDate: currentDate }
      );
      return res.status(200).json({ message: "Leave request successfully canceled during the leave period" });
    } else {
      // If the leave period is over
      return res.status(400).json({ message: "Cannot cancel a leave request that has already ended" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Function for employee to view the request he/ she sends
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const viewMyRequest = async (req, res)=>{
  try {
    const {employeeId} = req.params
    const request = await Leave.findOne({_id: employeeId}) 

    if(!employeeId){
      return res.status(404).json({message:"Request not found"})
    }
    return res.status(200).json({message:"Success", request})

  } catch (error) {
    return res.status(500).json({message:"Internal sever error", error: error.message})
  }
}

/**
 * function to return summary of statuses
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getLeaveRequestSummary = async (req, res) => {
  try {
    const leaveRequests = await Leave.aggregate([
      {
        $group: {
          _id: "$status", // Group by the 'status' field
          count: { $sum: 1 } // Count the number of documents in each group
        }
      }
    ]);

    // Map the results to a more user-friendly response
    const response = {
      pending: 0,
      approved: 0,
      denied: 0
    };

    leaveRequests.forEach((request) => {
      if (request._id === "Pending") response.pending = request.count;
      else if (request._id === "Approved") response.approved = request.count;
      else if (request._id === "Denied") response.denied = request.count;
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    throw error;
  }
};

export default { cancelRequest, viewMyRequest, getLeaveRequestSummary}