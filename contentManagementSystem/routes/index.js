import express from 'express';
const Router3 = express.Router();
import programRouter from './programRoutes.js';
import contactRouter from './contactRoute.js';

Router3.use('/programs', programRouter);
Router3.use('/contacts', contactRouter);

export default Router3;