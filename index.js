const express = require("express");
const dotenv = require("dotenv");

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
 * Connect DB and start server
 */
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });
};

startServer();
