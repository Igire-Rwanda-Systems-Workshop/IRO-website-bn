import express from 'express';
const Router2 = express.Router();
import userRouter from './authRout.js';
import tokenRouter from './tokenRout.js';

Router2.use('/Emply-users', userRouter);
Router2.use('/tokens', tokenRouter);

export default Router2;