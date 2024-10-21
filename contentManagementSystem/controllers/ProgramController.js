import ProgramModel from "../models/ProgramModel.js";
import NotFoundError from "../../Errors/NotFoundError.js";
import BadRequestError from "../../Errors/BadRequestError.js";
import { validationResult } from "express-validator";
import asyncWrapper from "../../middleware/async.js";

const createProgram = asyncWrapper(async(req, res, next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(new BadRequestError(errors.array()[0].msg));
    }
    const newProgram = await ProgramModel.create(req.body);
    return res.status(201).json(newProgram);
});

const getAllPrograms = asyncWrapper(async(req, res, next) => {
    const programs = await ProgramModel.find({})
    if(programs){
        return res.status(201).json({
            nbHits: programs.length,
            programs
        });
    }
    res.status(400).json({message: 'programs not found!'});
});

const getProgramById = asyncWrapper(async(req, res, next) => {
    const programId = req.params.id;
    const program = await ProgramModel.findById(programId);
    if(!program){
        return next(new NotFoundError('Program not found'));
    }
    return res.status(200).json({program: program});
});

const updateProgram = asyncWrapper(async(req, res, next) => {
    const programId = req.params.id;
    const updates = req.body;
    const updatedProgram = await ProgramModel.findByIdAndUpdate(programId, updates, {new: true});
    if(!updatedProgram){
        return next (new NotFoundError('Program not found'));
    }
    return res.status(200).json({program: updatedProgram});
});

const deleteProgram = asyncWrapper(async(req, res, next) => {
   const programId = req.params.id;
   const deletedProgram = await ProgramModel.findByIdAndDelete(programId)
   if(!deletedProgram){
       return next(new NotFoundError('Program not found'));
   }
   return res.status(200).json({message: 'Program deleted successfully!'});
});

const programController = {
    createProgram,
    getAllPrograms,
    getProgramById,
    updateProgram,
    deleteProgram
}

export default programController;