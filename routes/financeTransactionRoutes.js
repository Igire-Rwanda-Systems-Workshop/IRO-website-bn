// routes/financeTransactionRoutes.js
const express = require('express');
const router = express.Router();
const financeTransactionController = require('../controllers/financeTransactionController');
// const multer = require('multer');

// Configure Multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); 
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });
// const upload = multer({ storage: storage });

// Route to view a transaction
router.get('/:id', financeTransactionController.viewTransaction);

// Route to initiate a payment
router.post('/initiate', financeTransactionController.initiatePayment);

// Route to upload proof of payment
// router.post('/upload/:id', upload.single('proofOfPayment'), financeTransactionController.uploadProofOfPayment);

module.exports = router;
