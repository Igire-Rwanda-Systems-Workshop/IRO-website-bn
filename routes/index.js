import express from 'express';
const Router = express.Router();
import userRouter from '../routes/userRoute.js';
import categoryRouter from '../routes/categoryRoute.js';
import productRouter from '../routes/productRoute.js';


Router.use('/users', userRouter);
Router.use('/category', categoryRouter);
Router.use('/product', productRouter);

export default Router;