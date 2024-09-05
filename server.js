import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Router from './routes/index.js';
import { fileURLToPath} from 'url';
import path from 'path';

// Initialize express app
const app = express();

const corsOptions = {
    allowedHeaders: ["Authorization", "Content-Type" ],
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    origin: "*",
};
// Middleware
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json()); 
app.use('/api/InventorySystem', Router);

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
// const swaggerOptions = {
//     swaggerDefinition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Node.js API',
//             version: '1.0.0',
//             description: 'A simple Express API',
//         },
//         servers: [
//             {
//                 url: `http://localhost:${process.env.PORT || 5000}`,
//             },
//         ],
//     },
//     apis: [path.join(__dirname, 'routes/*.js'), path.join(__dirname, 'server.js')], // Path to API docs
// };

// Swagger docs setup
// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
// app.use("/api/auth", authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\x1b[36m%s\x1b[0m", `Server running on port ${PORT}`);
});
