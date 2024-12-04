import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import inventoryRouters from './routes/inventory/index.js';
import employeeRoutes from './routes/employee/routes.js'
import swaggerUi from 'swagger-ui-express';
// import swagger from './docs/swagger.json' assert { type: "json" }; // Assuming 'swagger.json' contains the combined API documentation

// Initialize express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:8000', 'https://iro-website-bn.onrender.com'], // Add your deployed URL
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'UPDATE', 'DELETE'],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// API Endpoints
app.use('/api/inventory', inventoryRouters);
app.use('api/employee', employeeRoutes)

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

// Connect to MongoDB (assuming 'connection.js' already exists)
import connection from './db/connection.js'; // Assuming 'connection.js' defines the connection logic

connection.then(() => {
  console.log(`\x1b[32m%s\x1b[0m`, `MongoDB connected successfully`);

  // Start server
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(error => {
  console.error(`\x1b[31m%s\x1b[0m`, `MongoDB connection failed: ${error.message}`);
  process.exit(1);
});

// Error handling middleware (assuming it's the same in both files)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app; // Optional export for potential unit testing