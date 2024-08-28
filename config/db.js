const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        console.error('\x1b[31m%s\x1b[0m', 'Error: MONGO_URI is not defined in .env file');
        process.exit(1);  // Exit the process with failure
    }

    try {
        await mongoose.connect(mongoURI);
        console.log('\x1b[32m%s\x1b[0m', 'MongoDB connected successfully');  // Green text for success
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', `MongoDB connection failed: ${error.message}`);  // Red text for error
        process.exit(1);  // Exit process with failure
    }
};

module.exports = connectDB;
