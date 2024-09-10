const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Admin signup and OTP verification
router.post('/signup', userController.adminSignup);
router.post('/verify-otp', userController.verifyOTP);

// Login for both admin and users
router.post('/login', userController.login);

// Admin user management (create, update, delete users)
router.post('/create-user', userController.createUser);
router.put('/update-user/:id', userController.updateUser);
router.delete('/delete-user/:id', userController.deleteUser);

// Password reset
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
