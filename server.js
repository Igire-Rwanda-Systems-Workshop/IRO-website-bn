import dotenv from "dotenv";
dotenv.config();
<<<<<<< HEAD
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Router from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Router2 from "./Employee/Routes/index.js";
import Router3 from "./contentManagementSystem/routes/index.js";
import swaggerUi from "swagger-ui-express";
import swagger from "./docs/swagger.json" assert { type: "json" };
import heroRoutes from "./contentManagementSystem/routes/heroRoutes.js";
import contentRoutes from "./contentManagementSystem/routes/contentRoutes.js";
import bodyParser from "body-parser";
=======
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
>>>>>>> 147558016a71395dabc08340bef758ffa075a190


// Initialize express app
const app = express();

<<<<<<< HEAD
// CORS Configuration
const corsOptions = {
<<<<<<< HEAD
  origin: ["http://localhost:3000", "https://iro-website-bn.onrender.com"], // Add your deployed URL
  credentials: true, // Allow credentials like cookies
  allowedHeaders: ["Authorization", "Content-Type"],
  methods: ["GET", "POST", "PUT", "UPDATE", "DELETE", "OPTIONS"], // Added OPTIONS for pre-flight requests
=======
    origin: ['http://localhost:3000', 'https://iro-website-bn.onrender.com'], // Add your deployed URL
    credentials: true, // Allow credentials like cookies
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'UPDATE', 'DELETE', 'OPTIONS'], // Added OPTIONS for pre-flight requests
>>>>>>> 147558016a71395dabc08340bef758ffa075a190
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS with the configured options
app.use(express.json());
=======
// const corsOptions = {
//     origin: ['http://localhost:5000', 'https://iro-website-bn.onrender.com'], // Add your deployed URL
//     credentials: true, // Allow credentials like cookies
//     allowedHeaders: ['Authorization', 'Content-Type'],
//     methods: ['GET', 'POST', 'PUT', 'UPDATE', 'DELETE'],
// };

// Middleware
app.use(cors());
app.use(express.json()); 
>>>>>>> 9c5b390 (fixed swagger)
app.use(bodyParser.json()); // To parse JSON bodies
app.use(cookieParser()); // Enable cookie parsing

// Routes
<<<<<<< HEAD
app.use("/api/Inventory", Router);
app.use("/api/Employee", Router2);
app.use("/api/website-content", heroRoutes);
app.use("/api/website", contentRoutes);
app.use("/api/website1", Router3);
=======
app.use('/api/Inventory', Router);
app.use('/api/Employee', Router2);
app.use('/api/website-content', heroRoutes);
app.use('/api/website', contentRoutes);
app.use('/api/website1', Router3);
>>>>>>> 147558016a71395dabc08340bef758ffa075a190

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

// Connect to MongoDB
const connectDB = async () => {
<<<<<<< HEAD
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
=======
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
>>>>>>> 147558016a71395dabc08340bef758ffa075a190
    }

    // Attempt to connect to MongoDB without deprecated options
    await mongoose.connect(process.env.MONGO_URI);
    console.log("\x1b[32m%s\x1b[0m", "MongoDB connected successfully");
  } catch (error) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      `MongoDB connection failed: ${error.message}`
    );
    process.exit(1); // Exit with failure code
  }
};

connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
