import notificationController from '../controllers/notificationController.js'
import express from 'express';
const notificationRouter = express.Router();

// Create a notification
notificationRouter.post('/create', notificationController.createNotification);

// Mark a notification as read
notificationRouter.patch('/:id/read', notificationController.markNotificationAsRead);

// Get notifications by user
notificationRouter.get('/user/:userId', notificationController.getNotificationsByUser);

notificationRouter.delete('/:id/deleteNotifficationById', notificationController.deleteNotifactionById)

export default notificationRouter;
