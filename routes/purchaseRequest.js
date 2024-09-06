import requestControllers from "../controllers/purchaseRequest.js";
import express from "express";
const requestRouter = express.Router();

requestRouter.post('/create', requestControllers.createRequest);
requestRouter.get('/getAll', requestControllers.getAllRequests);
requestRouter.get('/getById/:id', requestControllers.getRequestById);
requestRouter.put('/update/:id', requestControllers.updateRequest);
requestRouter.delete('/delete/:id', requestControllers.deleteRequest);

export default requestRouter;