import contactModel from "../models/contactModel.js";
import NotFoundError from "../../Errors/NotFoundError.js";
import BadRequestError from "../../Errors/BadRequestError.js";
import { validationResult } from "express-validator";
import asyncWrapper from "../../middleware/async.js";

const createContact = asyncWrapper(async(req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new BadRequestError(errors.array()[0].msg));
    }
    const newContact = await contactModel.create(req.body);
    return res.status(201).json(newContact);
});

const readContacts = asyncWrapper(async(req, res, next) =>{
    const contacts = await contactModel.find({})
    if(!contacts){
        return next(new NotFoundError({message: 'No contacts found.'}));
    }
    res.status(200).json(contacts);
});
const getSingleContact = asyncWrapper(async(req, res, next) =>{
    const contactId = req.params.id;
    const contact = await contactModel.findById(contactId);
    if(!contact){
        return next(new NotFoundError({message: 'No contact with this id.'}));
    }
    res.status(200).json(contact);
});

const updateContact = asyncWrapper(async(req, res, next) =>{
    const contactId = req.params.id;
    const updates = req.body;
    const contacts = await contactModel.findByIdAndUpdate(contactId, updates, {new: true});
    if(!contacts){
        return res.status(404).json({message: 'contact not found'});
    }
    res.status(200).json({success: true, message: 'contact successfully updated'})
});

const deleteContact = asyncWrapper(async(req, res, next) =>{
    const contactId = req.params.id;
    const deletedContact = await contactModel.findByIdAndDelete(contactId);
    if(!deletedContact){
        return res.status(404).json({message: 'contact not found'});
    }
    res.status(200).json({message: 'contact successfully deleted'});
});

const contactControllers = {
    createContact,
    readContacts,
    updateContact,
    deleteContact,
    getSingleContact,
};
export default contactControllers;