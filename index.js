/**
 * Load environment variables from .env file
 * IMPORTANT: This must be the first line so all process.env variables
 * are available before any other imports run
 */
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const globalErrorHandler = require("./middlewares/errorHandler");

const app = express();

/**
 * Application Port
 * - Falls back to 4000 if PORT is not defined in .env
 */
const PORT = process.env.PORT || 4000;

/**
 * Global Middlewares
 * - These middlewares run for every incoming request
 */

/**
 * Parse incoming JSON payloads
 * - Example: { "email": "test@mail.com" }
 */
app.use(express.json());

/**
 * Parse URL-encoded form data
 * - Example: email=test@mail.com&password=123456
 */
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes
 * - All routes are prefixed with:
 * - /cms/api/v1
 */
app.use("/cms/api/v1/auth", authRoutes);


// Global error handler (must be last)
app.use(globalErrorHandler);

/**
 * Server Bootstrap Function
 * - 1. Connect to the database
 * - 2. Start the Express server
 */
const startServer = async () => {
  try {
    // Establish database connection
    await connectDB();

    // Start listening for incoming HTTP requests
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    // Log startup errors and exit process
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Initialize application
startServer();
