const { USER_STATUS } = require("../constants/user.constants");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../utils/jwt");

/**
 * Middleware to check if user is logged in
 * - Reads JWT from Authorization header
 * - Verifies token
 * - Checks if user exists and is active
 */
exports.isAuthenticate = async (req, res, next) => {
  // 1. Get token from "Authorization: Bearer <token>"
  const token = req.headers.authorization?.split(" ")[1];

  // 2. If token not found, user is not logged in
  if (!token) {
    return next(new AppError("Please login to access this resource", 401));
  }

  // 3. Verify token and extract user id
  const { id } = verifyAccessToken(token);

  // 4. Find user in database (only required fields)
  const user = await User.findById(id).select("role status");

  // 5. If user does not exist (deleted account)
  if (!user) {
    return next(new AppError("User account does not exist", 401));
  }

  // 6. If user is blocked or inactive
  if (user.status === USER_STATUS.BANNED) {
    return next(new AppError("Your account has been banned", 403));
  }

  // 7. Attach user data to request object
  req.user = user;

  // 8. Allow request to continue
  next();
};
