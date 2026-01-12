const jwt = require("jsonwebtoken");

/**
 * Environment variables
 */
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

/**
 * Fail fast if env variables are missing
 */
if (!JWT_SECRET || !JWT_EXPIRES_IN) {
  throw new Error(
    "JWT_SECRET or JWT_EXPIRES_IN is not defined in environment variables"
  );
}

/**
 * Sign access token
 * - payload
 * - returns {String} JWT
 */
const signAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify access token
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
};
