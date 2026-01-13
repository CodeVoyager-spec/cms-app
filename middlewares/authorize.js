const AppError = require("../utils/AppError");

/**
 * Middleware for role-based access control
 * - roles: - Allowed user roles
 */
exports.authorize = (...roles) => (req, res, next) => {
    // Check if logged-in user's role is allowed
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to perform this action", 403)
      );
    }

    // Role allowed → continue
    next();
};
