import express from 'express';
const Router2 = express.Router();
import userRouter from './authRout.js';

Router2.use('/Emply-users', userRouter);

export default Router2;