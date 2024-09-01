import express from 'express';
const Router = express.Router();
import requestRouter from "./purchaseRequest.js";

Router.use('/purchases', requestRouter);

export default Router;