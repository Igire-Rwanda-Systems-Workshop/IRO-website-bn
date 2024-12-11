import express from 'express';
import checkRole from '../middleware/permission.js';
import  userController from '../controller/userController.js';
const  userRouter = express.Router();
import authenticate from '../middleware/authmiddleware.js';
import { setupUserPassword } from '../controller/userController.js'





// Admin signup and OTP verification
userRouter.post('/signup', userController.adminSignup);
userRouter.post('/verify-otp', userController.verifyOTP);
userRouter.get('/', userController.getAll)
// set user password
userRouter.post('/setup-password', setupUserPassword);
// Login for both admin and users
userRouter.post('/login', userController.login);

// Admin user management (create, update, delete users)
userRouter.post('/create-user', checkRole('admin'), userController.createUser);
userRouter.put('/update-user/:id', checkRole('admin'),userController.updateUser);
userRouter.delete('/delete-user/:id',checkRole('admin'),userController.deleteUser);
userRouter.put('/change-password',authenticate, userController.changePassword);

// Password reset
// userRouter.post('/forgot-password', userController.forgotPassword);
// userRouter.post('/reset-password', userController.resetPassword);

export default  userRouter;
