import express from 'express';
const Router3 = express.Router();
import programRouter from './programRoutes.js';

Router3.use('/programs', programRouter);

export default Router3;