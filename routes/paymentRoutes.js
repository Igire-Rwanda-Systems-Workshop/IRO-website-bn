const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); 
const { recordPayment, viewPayment, getAllPayments } = require('../controllers/PaymentController ');

// Record a new payment
router.post('/payments', upload.single('proof_of_payment'), recordPayment);

// View a specific payment
// router.get('/payments/:id', viewPayment);
router.get('/payments/:id', viewPayment);  // Will handle both fetching by ID and fetching all payments


module.exports = router;
