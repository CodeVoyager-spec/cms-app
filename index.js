const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");

// Load envrionment variable
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * Global Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes
 * Base route - /cms/api/v1
 */
app.use("/cms/api/v1/auth", authRoutes);

/**
 * Connect DB and start server
 */
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });
};

startServer();
