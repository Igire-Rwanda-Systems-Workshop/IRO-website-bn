import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Router from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Router2 from './Employee/Routes/index.js';
import Router3 from './contentManagementSystem/routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swagger from './docs/swagger.json' assert { type: "json" };
import heroRoutes from './contentManagementSystem/routes/contentRoutes.js';
import contentRoutes from './contentManagementSystem/routes/contentRoutes.js';
import bodyParser from 'body-parser';

// Initialize express app
const app = express();

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://iro-website-bn.onrender.com'], // Add your deployed URL
    credentials: true, // Allow credentials like cookies
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'UPDATE', 'DELETE', 'OPTIONS'], // Added OPTIONS for pre-flight requests
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS with the configured options
app.use(express.json());
app.use(bodyParser.json()); // To parse JSON bodies
app.use(cookieParser()); // Enable cookie parsing

// Routes
app.use('/api/Inventory', Router);
app.use('/api/Employee', Router2);
app.use('/api/website-content', heroRoutes);
app.use('/api/website', contentRoutes);
app.use('/api/website1', Router3);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

// Connect to MongoDB
const connectDB = async () => {
    try {
        // Check if MONGO_URI is defined
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }

        // Attempt to connect to MongoDB without deprecated options
        await mongoose.connect(process.env.MONGO_URI);
        console.log('\x1b[32m%s\x1b[0m', 'MongoDB connected successfully');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', `MongoDB connection failed: ${error.message}`);
        process.exit(1); // Exit with failure code
    }
};

connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
