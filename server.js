import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Router from './routes/index.js';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import specs from './Docs/swagger.js'; 

// Initialize express app
const app = express();

const corsOptions = {
    origin: ['http://localhost:8000', 'https://iro-website-bn.onrender.com'], // Add your deployed URL
    credentials: true, // Allow credentials like cookies
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'UPDATE', 'DELETE'],
};


app.use(cors());


// Middleware
app.use(cors(corsOptions));
app.use(express.json()); 
app.use(bodyParser.json()); // To parse JSON bodies
app.use('/api/Inventory', Router);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs)); // <-- Use 'specs' from the Swagger config file
console.log('our specs are',specs);

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(`MONGO_URI environment variable is not defined`);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`\x1b[32m%s\x1b[0m`, `MongoDB connected successfully`);
    } catch (error) {
        console.error(`\x1b[31m%s\x1b[0m`, `MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
