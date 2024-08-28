const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('\x1b[32m%s\x1b[0m', 'MongoDB connected successfully'); // Green text for successful connection
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', `MongoDB connection failed: ${error.message}`); 
        process.exit(1);  // Exit process with failure
    }
};

connectDB();

// Define Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', `Server running on port ${PORT}`); 
});
