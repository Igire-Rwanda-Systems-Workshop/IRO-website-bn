import requestModel from "../models/purchaseRequest.js";
import NotFoundError from "../Errors/NotFoundError.js";
import BadRequestError from "../Errors/BadRequestError.js";
import ErrorHandler from "../middleware/ErrorHandler.js";
import asyncWrapper from "../middleware/async.js";
import { validationResult } from "express-validator";

const createRequest = asyncWrapper(async(req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new BadRequestError('Validation failed', errors.array());
    }
    const newRequest = await requestModel.create(req.body);
    return res.status(201).json({message: 'Request created successfully!'});
});

const getAllRequests = asyncWrapper(async(req,res,next) =>{
    const requests = await requestModel.find({})
    if(requests){
        return res.status(201).json({
            nbHits: requests.length,
            requests
        })
    }
    res.status(404).json({message: 'No request found!'})
});

const getRequestById = asyncWrapper(async(req, res, next) =>{
    const requestId = req.params.id;
    const request = await requestModel.findById(requestId);
    if(!request){
        return next(new NotFoundError({message: 'No request with this id.'}))
    }
    res.status(201).json(requestId);
});

const updateRequest = asyncWrapper(async (req, res, next) =>{
    const requestId = req.params.id;
    const updates = req.body;
    const request = await requestModel.findByIdAndUpdate(requestId, updates, {new: true});
    if(!request){
        return next(new NotFoundError({message: 'No request with this id.'}))
    }
    res.status(201).json(request);
});

const deleteRequest = asyncWrapper(async (req, res, next) =>{
    const requestId = req.params.id;
    const request = await requestModel.findByIdAndDelete(requestId);
    if(!request){
        return next(new NotFoundError({message: 'No request with this id.'}))
    }
    res.status(201).json({message: 'Request deleted successfully!'});
});

const requestControllers = {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest
}
export default requestControllers;
