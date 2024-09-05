import express from 'express';
const Router = express.Router();
import itemRouter from './item.js';
import requestRouter from './request.js';

Router.use('/purchases', requestRouter);
Router.use('/items', itemRouter);
Router.use('/requests', requestRouter);

export default Router;