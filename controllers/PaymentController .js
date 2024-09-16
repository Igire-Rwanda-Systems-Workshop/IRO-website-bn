import paymentModel from '../models/PaymentModel.js';
import notificationModel from '../models/notificationModel.js';
import userModel from '../models/userModel.js'; 
import asyncWrapper from '../middleware/async.js';

// Record Payment
const recordPayment = asyncWrapper(async (req, res) => {
    const { finance_id, request_id, amount, payment_method } = req.body;
    const file = req.file;

    // Validate required fields
    if (!finance_id || !request_id || !amount || !payment_method) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!file) {
        return res.status(400).json({ message: "File is required" });
    }

    try {
        // Create a new payment instance
        const payment = new paymentModel({
            finance_id,
            request_id,
            amount,
            payment_method,
            proof_of_payment: {
                filename: file.filename, 
                path: file.path,         
                mimetype: file.mimetype, 
                size: file.size          
            }
        });

        const savedPayment = await payment.save();

        // Notify Operations Manager and Project Director
        const operationsManager = await userModel.findById(finance_id); // Assuming finance_id is the Operations Manager's id
        const projectDirector = await userModel.findOne({ role: 'projectDirector' });

        if (operationsManager) {
            await notificationModel.create({
                email: operationsManager.email,
                name: req.user.name,
                message: `A payment of ${amount} has been recorded for request ${request_id}`,
                recipient: operationsManager._id,
                status: 'unread',
                type: 'Payment Update'
            });

            // Emit WebSocket event for Operations Manager
            io.emit('notification', {
                userId: operationsManager._id,
                message: `A payment of ${amount} has been recorded for request ${request_id}`,
                type: 'Payment Update'
            });

            console.log(`Notification sent to Operations Manager (ID: ${operationsManager._id})`);
        }

        if (projectDirector) {
            await notificationModel.create({
                email: projectDirector.email,
                name: req.user.name,
                message: `A payment of ${amount} has been made for request ${request_id}`,
                recipient: projectDirector._id,
                status: 'unread',
                type: 'Payment Update'
            });

            // Emit WebSocket event for Project Director
            io.emit('notification', {
                userId: projectDirector._id,
                message: `A payment of ${amount} has been made for request ${request_id}`,
                type: 'Payment Update'
            });

            console.log(`Notification sent to Project Director (ID: ${projectDirector._id})`);
        }

        return res.status(201).json({ 
            message: "Payment recorded successfully", 
            payment: savedPayment 
        });
    } catch (error) {
        console.error("Error recording payment:", error);
        return res.status(500).json({ message: "Server error", error });
    }
});


// Fetch Payment by ID or Fetch All Payments
const viewPayment = asyncWrapper(async (req, res) => {
    const paymentId = req.params.id;

    try {
        // If the id is "all", fetch all payments
        if (paymentId === "all") {
            const payments = await paymentModel.find();
            return res.status(200).json({
                message: "All payments retrieved successfully",
                payments
            });
        }

        // Otherwise, find payment by ID
        const payment = await paymentModel.findById(paymentId);

        // Check if payment exists
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        // Return payment details
        return res.status(200).json({
            message: "Payment retrieved successfully",
            payment
        });
    } catch (error) {
        console.error("Error retrieving payment:", error);
        return res.status(500).json({ message: "Server error", error });
    }
});

// Fetch all payments
const getAllPayments = asyncWrapper(async (req, res) => {
    try {
        // Fetch all payments from the database
        const payments = await paymentModel.find();
        
        // Return all payment details
        return res.status(200).json({
            message: "Payments retrieved successfully",
            payments
        });
    } catch (error) {
        console.error("Error retrieving payments:", error);
        return res.status(500).json({ message: "Server error", error });
    }
});

// Export payment controllers
const paymentController = {
    recordPayment,
    viewPayment,
    getAllPayments
};

export default paymentController;
