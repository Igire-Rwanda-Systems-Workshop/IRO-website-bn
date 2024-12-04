import express from 'express';
const  Router = express.Router();
import userRouter from '../../routes/inventory/userRoute.js';
import categoryRouter from '../../routes/inventory/categoryRoute.js';
import productRouter from '../../routes/inventory/productRoute.js';


Router.use('/users', userRouter);
Router.use('/category', categoryRouter);
Router.use('/product', productRouter);

export default Router;