const Payment = require('../models/PaymentModel');

// Record Payment
exports.recordPayment = async (req, res) => {
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
        const payment = new Payment({
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
exports.viewPayment = async (req, res) => {
    try {
        const paymentId = req.params.id;

        // If the id is "all", fetch all payments
        if (paymentId === "all") {
            const payments = await Payment.find();
            return res.status(200).json({
                message: "All payments retrieved successfully",
                payments: payments
            });
        }

        // Otherwise, find payment by ID
        const payment = await Payment.findById(paymentId);

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


exports.getAllPayments= async(req,res)=>{
    try{
        // Fetch all payments from the database
        const payments = await Payment.find();
        
        // Return all payment details
        return res.status(200).json({
            message: "Payments retrieved successfully",
            payments: payments
        });
    } catch (error) {
        console.error("Error retrieving payments:", error);
        return res.status(500).json({ message: "Server error", error });
    }
    }

 
