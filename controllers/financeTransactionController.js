// controllers/financeTransactionController.js
const FinanceTransaction = require('../models/FinanceTransaction');
const nodemailer = require('nodemailer');
const path = require('path');

// View Transaction
exports.viewTransaction = async (req, res) => {
    try {
        const transaction = await FinanceTransaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Send Email
exports.sendEmail = async (email, subject, text) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Initiate Payment
exports.initiatePayment = async (req, res) => {
    try {
        const { requestId, amount, comment } = req.body;

        const newTransaction = new FinanceTransaction({
            requestId,
            amount,
            comment,
        });

        await newTransaction.save();

        // Optionally send an email notification
        const subject = 'Payment Initiated';
        const text = `Your payment of ${amount} has been initiated.`;
        exports.sendEmail('recipient-email@example.com', subject, text);

        res.status(201).json({ msg: 'Payment initiated successfully', newTransaction });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// get all payment

exports.getAllPayment = async (req, res) => {
    try {
        const transactions = await FinanceTransaction.find();
        res.status(200).json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });

    }
    
};












// Upload Proof of Payment

// exports.uploadProofOfPayment = async (req, res) => {
//     try {
//         const transaction = await FinanceTransaction.findById(req.params.id);
//         if (!transaction) {
//             return res.status(404).json({ msg: 'Transaction not found' });
//         }

//         transaction.proofOfPayment = req.file.path;
//         await transaction.save();

//         res.status(200).json({ msg: 'Proof of payment uploaded successfully', transaction });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ msg: 'Server error' });
//     }
// };
