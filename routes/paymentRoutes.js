import express from 'express';
const paymentRouter = express.Router();
import {upload} from '../middleware/multer.js'; 
import paymentController from '../controllers/PaymentController .js';

// Record a new payment
paymentRouter.post('/payments', upload.single('proof_of_payment'), paymentController.recordPayment);

// View a specific payment
paymentRouter.get('/findPaymentId/:id', paymentController.viewPayment);  // Will handle both fetching by ID and fetching all payments

export default paymentRouter;
