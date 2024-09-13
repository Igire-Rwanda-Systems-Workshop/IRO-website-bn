import userController from "../Controllers/AuthControl.js";
import express from 'express';
const userRouter = express.Router();

userRouter.post('/signup',userController.signUp);
userRouter.post('/login',userController.signIn)
userRouter.post('/verify',userController.validateOtp);
userRouter.post('/forgotPassword', userController.forgotPassword);
userRouter.post('/reset', userController.resetPassword);
userRouter.delete('/delete/:id', userController.deleteUser);

export default userRouter;