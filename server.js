import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";
import Router from "./routes/index.js";
import http from 'http';
import { Server } from 'socket.io'; 

dotenv.config();

const app = express(); // Initialize app here, before using it

// Create the HTTP server
const server = http.createServer(app);

// Initialize socket.io with the server
const io = new Server(server);

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup WebSocket connection
io.on('connection', (socket) => {
    console.log('New user connected');
    
    // Emit message from server to user
    socket.emit('newMessage', {
        from: "jen@mds",
        text: "hello",
        createdAt: new Date().getTime()
    });

    // Listen for message from user
    socket.on('createMessage', (newMessage) => {
        console.log('New Message', newMessage);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("\x1b[32m%s\x1b[0m", "MongoDB connected successfully");
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", `MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};
connectDB();

// Serve static files or a home route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client-index.html");
});

// Use API routes
app.use('/api/system', Router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default { io };
