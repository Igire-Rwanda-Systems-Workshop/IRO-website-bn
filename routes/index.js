import express from 'express';
const Router = express.Router();
import requestRouter from "./purchaseRequest.js";
import itemRouter from './item.js';

Router.use('/purchases', requestRouter);
Router.use('/items', itemRouter);

export default Router;