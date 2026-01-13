const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

module.exports = (err, req, res, next) => {
  /**
   * Custom application errors
   */
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      // optional: include extra details if available
      errors: err.errors || undefined,
    });
  }

  /**
   * Invalid MongoDB ObjectId
   */
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: "Invalid ID format. Please provide a valid resource ID.",
    });
  }

  /**
   * Duplicate key (unique field already exists)
   */
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      message: `${field} already exists. Please use a different value.`,
    });
  }

  /**
   * Mongoose schema validation errors
   */
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Invalid data provided. One or more fields failed validation.",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  /**
   * JWT authentication errors
   */
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      message: "Your session has expired. Please login again.",
    });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      message: "Authentication failed. Invalid or malformed token.",
    });
  }

  /**
   * Unknown / unhandled errors
   */
  console.error("Unhandled error:", err);

  return res.status(500).json({
    message: "Something went wrong on our side. Please try again later.",
  });
};
