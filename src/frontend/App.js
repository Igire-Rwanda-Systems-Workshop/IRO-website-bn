import socket from '../socket/socketClient.js';  
import express from 'express';  

const app = express();
// Frontend code here
console.log('App is running and connected to Socket.IO');

// You can interact with the socket here or listen for events
socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

export default app; 