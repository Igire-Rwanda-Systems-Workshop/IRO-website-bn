const express = require('express');
const { signup, verifyAccount, login, forgotPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup route
router.post('/signup', signup);

// Verify account route
router.post('/verify-account', verifyAccount);

// Login route
router.post('/login', login);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', authController.resetPassword); 

module.exports = router;
