const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const financeTransactionRoutes = require('./routes/financeTransactionRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); 
const path =require('path');
const url = require('url');



// Initialize express app
const app = express();

const corsOptions = {
    allowedHeaders: ["Authorization", "Content-Type" ],
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    origin: "*",
};
const __fileName = url.fileURLToPath(url.pathToFileURL(__filename));
console.log(__filename); 


// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("\x1b[32m%s\x1b[0m", "MongoDB connected successfully");
  } catch (error) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      `MongoDB connection failed: ${error.message}`
    );
    process.exit(1);
  }
};
connectDB();


app.get("/", (req, res) => {
  res.send("Welcome to the Node.js API!");
});

// Routes
app.use('/api/', userRoutes); 
app.use('/api/transactions', financeTransactionRoutes);
app.use('/api/', paymentRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\x1b[36m%s\x1b[0m", `Server running on port ${PORT}`);
});
