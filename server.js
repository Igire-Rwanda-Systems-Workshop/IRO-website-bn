const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const dotenv = require("dotenv");
const swaggerJsDoc = require('swagger-jsdoc');

const path = require("path");
const authRoutes = require("./routes/authRoutes");

// Initialize dotenv to use environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(authController.authenticateUser);


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
    process.exit(1); // Exit process with failure
  }
};
connectDB();

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Node.js API',
            version: '1.0.0',
            description: 'A simple Express API',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
            },
        ],
    },
    apis: [path.join(__dirname, 'routes/*.js'), path.join(__dirname, 'server.js')], // Path to API docs
};

// Swagger docs setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// // Sample route with Swagger documentation
// /**
//  * @swagger
//  * /:
//  *   get:
//  *     summary: Welcome message
//  *     responses:
//  *       200:
//  *         description: Success
//  */
app.get("/", (req, res) => {
  res.send("Welcome to the Node.js API!");
});

// Routes
app.use("/api/auth", authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\x1b[36m%s\x1b[0m", `Server running on port ${PORT}`);
});
