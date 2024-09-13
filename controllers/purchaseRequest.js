import requestModel from "../models/purchaseRequest.js";
import NotFoundError from "../Errors/NotFoundError.js";
import BadRequestError from "../Errors/BadRequestError.js";
import ErrorHandler from "../middleware/ErrorHandler.js";
import asyncWrapper from "../middleware/async.js";
import { validationResult } from "express-validator";
import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";
// import  authMiddleware from "../middleware/authMiddleware.js";


const createRequest = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new BadRequestError('Validation failed', errors.array());
    }

    // Ensure req.user exists and has a name
    if (!req.user || !req.user.name) {
        return res.status(400).json({ msg: 'User information is missing or invalid' });
    }

    const newRequest = await requestModel.create(req.body);

    // Notify the Project Director (CEO) about the new request
    const director = await userModel.findOne({ role: 'project Director' });
    
    if (director) {
        await notificationModel.createNotification(
            `New purchase request created by ${req.user.name}`, 
            director._id, 
            'Request Approval'
        );
    }

    return res.status(201).json({ message: 'Request created successfully!' });
});


const getAllRequests = asyncWrapper(async (req, res, next) => {
    const requests = await requestModel.find({});
    if (requests) {
        return res.status(201).json({
            nbHits: requests.length,
            requests
        });
    }
    res.status(404).json({ message: 'No request found!' });
});

const getRequestById = asyncWrapper(async (req, res, next) => {
    const requestId = req.params.id;
    const request = await requestModel.findById(requestId);
    if (!request) {
        return next(new NotFoundError({ message: 'No request with this id.' }));
    }
    res.status(201).json(requestId);
});

const updateRequest = asyncWrapper(async (req, res, next) => {
    const requestId = req.params.id;
    const updates = req.body;
    const request = await requestModel.findByIdAndUpdate(requestId, updates, { new: true });
    if (!request) {
        return next(new NotFoundError({ message: 'No request with this id.' }));
    }

    // Notify the Operations Manager about the status of their request (approval/rejection)
    if (updates.status === 'approved' || updates.status === 'rejected') {
        const operationsManager = await userModel.findById(request.createdBy); // Assuming `createdBy` stores the request creator (operations manager)
        if (operationsManager) {
            await notificationModel.createNotification(
                `Your purchase request has been ${updates.status}`, // Customize message
                operationsManager._id,
                'Request Status'
            );
        }
    }

    res.status(201).json(request);
});

const deleteRequest = asyncWrapper(async (req, res, next) => {
    const requestId = req.params.id;
    const request = await requestModel.findByIdAndDelete(requestId);
    if (!request) {
        return next(new NotFoundError({ message: 'No request with this id.' }));
    }

    // Notify the Operations Manager that their request has been deleted
    const operationsManager = await userModel.findById(request.createdBy);
    if (operationsManager) {
        await notificationModel.createNotification(
            'Your purchase request has been deleted',
            operationsManager._id,
            'Request Deleted'
        );
    }

    res.status(201).json({ message: 'Request deleted successfully!' });
});

const requestControllers = {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest
};

export default requestControllers;
