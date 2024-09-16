import notificationModel from '../models/notificationModel.js';
import UserModel from '../models/userModel.js';
import mongoose from 'mongoose';



// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { email ,message, recipient, status, type } = req.body;

    // Validate recipient ID
    if (!mongoose.Types.ObjectId.isValid(recipient)) {
      return res.status(400).json({ msg: 'Invalid recipient ID' });
    }

    const user = await UserModel.findById(recipient);

    if (!user) {
      return res.status(404).json({ msg: `Recipient with ID ${recipient} not found` });
    }

    // Create the notification
    const newNotification = new notificationModel({
      email,
      message,
      recipient,
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
    const userId = req.user.id; 
    const notifications = await notificationModel.find({ recipientId: userId }).sort({ timestamp: -1 });

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

// / Create and Trigger Notifications from Other Controllers (Example Functions)
const triggerAdminSignupNotification = async (userId) => {
  try {
    // Validate if the userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid recipient ID');
    }

    // Convert the userId to a Mongoose ObjectId
    const recipientId = new mongoose.Types.ObjectId(userId);

    const message = 'Your account has been created successfully!';
    
    // Create the notification
    await createNotification({ 
      message, 
      recipient: recipientId,  // Use the valid and converted ObjectId
      status: 'unread', 
      type: 'Account Creation' 
    });

    console.log('Admin signup notification sent.');
  } catch (error) {
    console.error('Error sending notification:', error.message || error);
  }
};


// triggerPaymentNotification

const triggerPaymentNotification = async (userId, amount) => {
  try {
    const recipientId = mongoose.Types.ObjectId.isValid(userId);
    const message = `Your payment of ${amount} has been initiated.`;
    await createNotification({ message, recipient:recipientId, status: 'unread', type: 'Payment Initiated' });
  } catch (error) {
    console.error('Error sending payment notification:', error);
  }
};


const deletedNotification = async (req, res) => {
    const notificationId  = req.params.id;
    
    const deletedNotification = await notificationModel.findByIdAndDelete(notificationId);
   

    if (!deletedNotification) 
        return res.status(404).json({ message: 'Notification not found' });

    res.json({ message: 'Notification deleted successfully' });

    };

   


// Fetch all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.find({}).sort({ timestamp: -1 });

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
    deletedNotification, 
};

export default notificationControllers;

