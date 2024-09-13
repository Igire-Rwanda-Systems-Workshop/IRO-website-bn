import  notificationModel from '../models/notificationModel.js';
import UserModel from '../models/userModel.js';
import mongoose from 'mongoose';



// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { message, recipient, status, type } = req.body;

    // Use 'new' when creating an ObjectId
    const user = await UserModel.findById(new mongoose.Types.ObjectId(recipient));

    if (!user) {
      return res.status(404).json({ msg: `Recipient with ID ${recipient} not found` });
    }

    // Create the notification
    const newNotification = new notificationModel({
      message,
      recipient: user._id, // Use the user's ID
      status,
      type,
    });

    await newNotification.save();

    res.status(201).json({ msg: 'Notification created successfully', newNotification });
  } catch (err) {
    console.error('Error creating notification:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Fetch Notifications for a Specific User
const getNotificationsByUser = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming your JWT contains a user object with an id
        const notifications = await notificationModel.find({ recipient: userId }).sort({ timestamp: -1 });
        
        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notifications', error: err.message });
    }
};


// Mark Notification as Read
const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await notificationModel.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.status = 'read';
        await notification.save();

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Error marking notification as read', error: err.message });
    }
};

// Create and Trigger Notifications from Other Controllers (Example Function)
const triggerAdminSignupNotification = async (userId) => {
    try {
        // You can modify this function to accept relevant parameters
        const message = 'Your account has been created successfully!';
        await createNotification(message, userId, 'Account Creation');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

// Use in other controllers, e.g.:
const triggerPaymentNotification = async (userId, amount) => {
    try {
        const message = `Your payment of ${amount} has been initiated.`;
        await createNotification(message, userId, 'Payment Initiated');
    } catch (error) {
        console.error('Error sending payment notification:', error);
    }
};

// delete notifaction by id

const deleteNotifactionById = async (req,res)=>{
    const {notificationId} = req.params.id;
    const deleteNotifactionById = await notificationModel.findByIdAndDelete(notificationId);
    if (!deleteNotifactionById) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'notification deleted successfully' });
};
 


// Fetch all notifications for admin or users
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel.find().sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching all notifications', error: err.message });
    }
};
 const notificationControllers = {
    createNotification,
    getNotificationsByUser,
    markNotificationAsRead,
    triggerAdminSignupNotification,
    triggerPaymentNotification,
    getAllNotifications,
    deleteNotifactionById,
 }
 export default notificationControllers;