const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes for user authentication
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forget-password', authController.forgetPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verifyOtpAndSignin', authController.verifyOtpAndSignin);

module.exports = router;
