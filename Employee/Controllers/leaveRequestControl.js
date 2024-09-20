import leaveRequestModel from "../Models/LeaveRequest.js";
import NotFoundError from "../../Errors/NotFoundError.js";
import BadRequestError from "../../Errors/BadRequestError.js";
import { validationResult } from "express-validator";
import asyncWrapper from "../../middleware/async.js";
import sendEmail from "../../utils/sendEmail.js";
import nodemailer from 'nodemailer';

const createLeaveRequest = asyncWrapper(async (req, res, next) => {
try {
    const file = req.file;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }

    // Destructure request body
    const { employeeId, names, category, type, startDate, endDate, date, reason, status, email, createdAt } = req.body;

    // Create new leave request document
    const newDocument = new leaveRequestModel({
        employeeId,
        names,
        category,
        type,
        startDate,
        endDate,
        date,
        reason,
        status,
        email,
        createdAt,
    });

    // Add file information only if a file was uploaded
    if (file) {
        newDocument.file_document = {
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
        };
    }

    // Save document to the database
    await newDocument.save();
    res.status(201).json(newDocument);
} catch (error) {
    res.status(404).json({ message: 'Failed to upload document' });
}
});

// const sendByEmail = asyncWrapper(async (req, res, next) => {
//     const requestId = req.params.id;
//     const request = await leaveRequestModel.findById(requestId);

//     if (!request) {
//         return next(new NotFoundError('No request found'));
//     }

//     // Update the status to 'approved'
//     request.status = 'approved';  // Update the request object
//     await request.save();  // Save the updated request with 'approved' status

//     const email = request.email;  // Fetch the employee's email from the request object
//     const ceoEmail = process.env.CEO_EMAIL;  // CEO's email from environment variables
//     const ceoName = process.env.CEO_NAME;  // CEO's name from environment variables

//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: ceoEmail,  // Send from CEO's email
//             pass: process.env.CEO_EMAIL_PASSWORD,  // CEO's email password from environment variables
//         },
//     });

//     const mailOptions = {
//         from: `${ceoName} <${ceoEmail}>`,  // CEO's name and email
//         to: email,  // Send to employee's email
//         subject: 'Leave Request Approved',
//         text: `${leaveRequestModel.names},\n\nYour leave request for ${leaveRequestModel.startDate} to ${leaveRequestModel.endDate} has been approved by the CEO.\n\nPlease ensure that you plan your leave accordingly.\n\nBest regards,\n${ceoName}\nCEO, Leave Management System`,
//     };
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return next(error);
//         } else {
//             res.status(200).json({ message: 'Leave approval email sent successfully.', info });
//         }
//     });
// });

const getAllLeaveRequests = asyncWrapper(async (req, res, next) =>{
    const leaveRequests = await leaveRequestModel.find({})
    if(leaveRequests){
        return res.status(201).json({
            nbHits: leaveRequests.length,
            leaveRequests
        });
    }
    res.status(404).json({message: 'No requests found here.'});
});

const getLeaveRequestsById = asyncWrapper(async (req, res, next) =>{
    const requestId = req.params.id;
    const foundRequest = await leaveRequestModel.findById(requestId);
    if(!foundRequest){
        return next(new NotFoundError('Leave request not found'));
    }
    return res.status(201).json({foundRequest});
});

const updateLeaveRequest = asyncWrapper(async (req, res, next) =>{
    const requestId = req.params.id;
    const updates = req.body;
    const updatedRequest = await leaveRequestModel.findByIdAndUpdate(requestId, updates, {new: true});
    if(!updatedRequest){
        return next(new NotFoundError('No request found!'));
    }
    return res.status(201).json({updatedRequest});
});

const deleteLeaveRequest = asyncWrapper(async (req, res, next) =>{
    const requestId = req.params.id;
    const deletedRequest = await leaveRequestModel.findByIdAndDelete(requestId);
    if(!deletedRequest){
        return next(new NotFoundError('No request found!'));
    }
    return res.status(204).json({message: 'Request deleted successfully'});
});

const leaveRequestControllers = {
    createLeaveRequest,
    getAllLeaveRequests,
    getLeaveRequestsById,
    updateLeaveRequest,
    // sendByEmail,
    deleteLeaveRequest
};
export default leaveRequestControllers;