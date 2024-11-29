import express from 'express';
import UserController from '../controllers/userController.js'
import { authenticate }  from '../middlewares/auth.js';  
import userController from '../controllers/userController.js';

const router = express.Router();

// SignIn
router.post('/signup',userController.signup);   
router.post( '/signin', UserController.signin );


// Add User (Only admin can access this)
router.post('/add-user',UserController.AddUser);

// Forgot Password (for sending reset link)
router.post('/forgot-password', UserController.ForgotPassword);

// Request Password Change
router.post('/request-password-change', authenticate, UserController.RequestChangePassword);

// Reset Password (using token)
router.post('/reset-password', UserController.ResetPassword);

// Update Account Info (Only accessible by the user themselves or an admin)
router.put('/update-account', authenticate, UserController.UpdateAccountInfo);

// Delete Account (Only accessible by an admin)
router.delete('/delete-account', authenticate, UserController.DeleteAccount);

// Toggle Admin status (Only admin can toggle admin status)
router.post('/toggle-admin',  UserController.ToggleSetAdmin);

// Toggle Active status (Only admin can toggle active status)
router.post('/toggle-active', authenticate, UserController.ToggleIsActive);

export default router;
