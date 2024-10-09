import contactControllers from "../controllers/contactController.js";
import express from "express";
const contactRouter = express.Router();

contactRouter.post('/sendMessage', contactControllers.createContact);
contactRouter.get('/readAll', contactControllers.readContacts);
contactRouter.get('/readOne/:id', contactControllers.getSingleContact);
contactRouter.put('/update/:id', contactControllers.updateContact);
contactRouter.delete('/delete/:id', contactControllers.deleteContact);

export default contactRouter;