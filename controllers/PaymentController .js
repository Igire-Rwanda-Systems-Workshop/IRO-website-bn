import paymentModel from '../models/PaymentModel.js';
import notificationModel from '../models/notificationModel.js';
import userModel from '../models/userModel.js'; // Assuming there is a User Model

// Record Payment
const recordPayment = async (req, res) => {
    const { finance_id, request_id, amount, payment_method } = req.body;
    const file = req.file;  // Handle file upload

    try {
        console.log({ finance_id, request_id, amount, payment_method, file });

        // Validate file existence and its properties
        if (!file) {
            return res.status(400).json({ message: "File is required" });
        }
        console.log(file);

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

        // Save the payment to the database
        const savedPayment = await payment.save();

        // Notify the Operations Manager and Project Director about the payment
        const operationsManager = await userModel.findById(payment.finance_id); // Assuming finance_id is the Operations Manager's id
        const projectDirector = await User.findOne({ role: 'projectDirector' });

        if (operationsManager) {
            await notificationModel.createNotification(
                `Payment of ${amount} has been recorded for request ${request_id}`, 
                operationsManager._id,
                'Payment Update'
            );
        }

        if (projectDirector) {
            await notificationModel.createNotification(
                `A payment of ${amount} has been made for request ${request_id}`, 
                projectDirector._id,
                'Payment Update'
            );
        }

        return res.status(201).json({ 
            message: "Payment recorded successfully", 
            payment: savedPayment 
        });
    } catch (error) {
        console.error("Error recording payment:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

// Fetch Payment by ID or Fetch All Payments
const viewPayment = async (req, res) => {
    try {
        const paymentId = req.params.id;

        // If the id is "all", fetch all payments
        if (paymentId === "all") {
            const payments = await paymentModel.find();
            return res.status(200).json({
                message: "All payments retrieved successfully",
                payments: payments
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
            payment: payment
        });
    } catch (error) {
        console.error("Error retrieving payment:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

const getAllPayments = async (req, res) => {
    try {
        // Fetch all payments from the database
        const payments = await paymentModel.find();
        
        // Return all payment details
        return res.status(200).json({
            message: "Payments retrieved successfully",
            payments: payments
        });
    } catch (error) {
        console.error("Error retrieving payments:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

const paymentController = {
    recordPayment,
    viewPayment,
    getAllPayments
}
export default paymentController;
