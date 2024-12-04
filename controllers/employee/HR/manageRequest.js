import Leave from "../../../models/employee/leaves.js";
import Users from "../../../models/employee/usersSchema.js";
import main from "../../../utils/email/sendmail.js";
import Token from "../../../middleware/employee/JWT.js";
import LeaveType from "../../../models/employee/leaveType.js";

/**
 * This function returns all Leave Request
 * @param {*} req
 * @param {*} res
 * @returns
 */
const viewAllRequest = async (req, res) => {
  try {
    const leaveRequests = await Leave.find().populate({
      path: "userId",
      select: "firstName lastName email _id",
    });

    if (!leaveRequests) {
      return res.status(300).json({ message: "Leave Requests not selected" });
    }

    return res
      .status(200)
      .json({ message: "Success", leaveRequests: leaveRequests });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal sever error", error: error.message });
  }
};

/**
 * Function to
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const sendRequest = async (req, res) => {
  try {
    const { leaveTypeId, description, startDate, endDate } = req.body;

    if (!leaveTypeId || !description || !startDate || !endDate) {
      return res.status(400).json({ message: "Fill all fields in the form" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const tokenCredentials = await Token.decodeToken(token);

    const User = await Users.findOne({ email: tokenCredentials.email });
    if (!User) {
      return res.status(404).json({ message: "No User found" });
    }

    if (User.role === "Employee") {
      const supervisor = await Users.findOne({ _id: User.supervisorId });
      // Email logic
      if (supervisor) {
        const to = supervisor.email;
        const leaveType = await LeaveType.findOne({ _id: leaveTypeId });
        const text = `
              Dear ${supervisor.lastName} !,<br />
              I am submitting a leave request of type <b>${leaveType.leaveType}</b> for the reason: <b>${description}</b>.<br />
              Awaiting your response.<br />
          `;
        const bestregards = "Best regards";
        const email = "";
        await main(email, bestregards, text, to);
      }
    }

    if(User.role === "Supervisor"){
      const admin = await Users.findOne({ _id: User.id });
      // Email logic
      if (admin) {
        const to = admin.email;
        const leaveType = await LeaveType.findOne({ _id: leaveTypeId });
        const text = `
              Dear ${admin.lastName} !,<br />
              I am submitting a leave request of type <b>${leaveType.leaveType}</b> for the reason: <b>${description}</b>.<br />
              Awaiting your response.<br />
          `;
        const bestregards = "Best regards";
        const email = "";
        await main(email, bestregards, text, to);
      }
    }

    if(User.role === "Admin"){
      const admin = await Users.findOne({$and:[{ _id: {$ne: User.id} }, {role: User.role}]});
      // Email logic
      if (admin) {
        const to = admin.email;
        const leaveType = await LeaveType.findOne({ _id: leaveTypeId });
        const text = `
              Dear ${admin.lastName} !,<br />
              I am submitting a leave request of type <b>${leaveType.leaveType}</b> for the reason: <b>${description}</b>.<br />
              Awaiting your response.<br />
          `;
        const bestregards = "Best regards";
        const email = "";
        await main(email, bestregards, text, to);
      }
    }

    // Calculate the number of leave days
    const numberOfTime =
      new Date(endDate).getTime() - new Date(startDate).getTime();
    const numberOfDays = Math.round(numberOfTime / (1000 * 3600 * 24));

    if (numberOfDays <= 0) {
      return res
        .status(400)
        .json({ message: "End date must be after the start date" });
    }

    // Fetch leave records for the current year
    const currentYear = new Date().getFullYear();
    const leaveRecords = await Leave.find({
      userId: User.id,
      startDate: { $gte: `${currentYear}-01-01`, $lte: `${currentYear}-12-31` },
    });

    // Calculate the total leave days in the current year
    const totalDaysTaken = leaveRecords.reduce(
      (sum, record) => sum + record.numberOfDays,
      0
    );

    if (totalDaysTaken + numberOfDays >= 18) {
      return res
        .status(403)
        .json({
          message: "You have exceeded the allowed leave days for this year",
        });
    }

    // Create a leave request
    const leaveRequest = await Leave.create({
      userId: User.id,
      supervisorId: User.supervisorId,
      leaveTypeId,
      description,
      startDate,
      endDate,
      numberOfDays,
    });

    if (!leaveRequest) {
      return res.status(500).json({ message: "Leave request not sent" });
    }

    return res.status(200).json({ message: "Request sent successfully", leave: leaveRequest });

  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Function to Approve the leave request for Employee by Human Resource
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const confirmRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await Leave.findOne({ _id: id }).populate({
      path: "userId",
      select: "lastName email",});
    if (!leaveRequest) {
      return res.status(404).json({ message: "No request found" });
    }
    if(leaveRequest.status === "Denied"){
      return res.send({message:"Already Denied"})
    }

    // Extract token from headersuserId
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await Token.decodeToken(token);

    if(decoded.role === "Employee"){
      return res.send({message:"You're not allowed to confirm request"})
    }

    decoded.role === "Admin"
      ? leaveRequest.hrStatus = "Approved"
      : leaveRequest.supervisorStatus === "Approved";
    decoded.role === "Supervisor"
      ? leaveRequest.hrStatus = "Approved"
      : leaveRequest.supervisorStatus === "Approved";



    leaveRequest.status =
      leaveRequest.hrStatus === "Denied"
        ? "Denied"
        : leaveRequest.hrStatus === "Approved"
        ? "Approved"
        : leaveRequest.supervisorStatus === "Approved"
        ? "Approved"
        : leaveRequest.supervisorStatus === "Denied"
        ? "Denied"
        : "Pending";
    await leaveRequest.save();

       // Email structure Logic
       let to = leaveRequest.userId.email;
       let text = `Dear ${leaveRequest.userId.lastName}, <br /><br /> This is to say that your leave request is <b>Approved </b><br /><br />`;
       let bestregards = "Best regards";
       let email = "";
       await main(email, bestregards, text, to);
   
       

    return res.status(200).json({
      message: "Leave request Approved",
      leaveRequest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


/**
 * Function to Reject the leave request for Employee by Human Resource
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const denyRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await Leave.findOne({ _id: id }).populate({
      path:"userId",
      select:"lastName email"
    });

    if (!leaveRequest) {
      return res.status(404).json({ message: "No request found" });
    }

    if(leaveRequest.status === "Aprroved"){
      return res.send({message:"Already Approved"})
    }

    // Extract token from headers
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await Token.decodeToken(token);
    if(decoded.role === "Employee"){
      return res.send({message:"You're not allowed to deny Request"})
    }

    
    decoded.role === "Admin"
      ? (leaveRequest.hrStatus = "Denied")
      : leaveRequest.supervisorStatus === "Denied";
    decoded.role === "Supervisor"
      ? (leaveRequest.hrStatus = "Denied")
      : leaveRequest.supervisorStatus === "Denied";

    leaveRequest.status =
      leaveRequest.hrStatus === "Denied"
        ? "Denied"
        : leaveRequest.hrStatus === "Approved"
        ? "Approved"
        : leaveRequest.supervisorStatus === "Approved"
        ? "Approved"
        : leaveRequest.supervisorStatus === "Denied"
        ? "Denied"
        : "Pending";
    await leaveRequest.save();

    // Email structure Logic
    let to = leaveRequest.userId.email;
    let text = `Dear Employee ${leaveRequest.userId.lastName}, <br /><br /> This is to say that your leave request is <b>Denied. </b><br />`;
    let bestregards = "Best regards";
    let email = "";
    await main(email, bestregards, text, to);


    return res.status(200).json({
      message: "Leave request Rejected",
      leaveRequest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default { viewAllRequest, sendRequest, confirmRequest, denyRequest };
