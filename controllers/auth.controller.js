const User = require("../models/user.model");
const { USER_ROLE, USER_STATUS } = require("../constants/user.constants");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { signAccessToken } = require("../utils/jwt.utils");

/**
 * SIGNUP – Create new user
 * - Checks for existing email
 * - Assigns status based on role
 * - Creates user
 */
exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  // 1. Check if email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email is already registered", 400);
  }

  /**
   * 2. Decide initial user status
   * - AUTHOR → needs admin approval → PENDING
   * - READER / others → auto-approved → APPROVED
   */
  const status =
    role === USER_ROLE.AUTHOR ? USER_STATUS.PENDING : USER_STATUS.APPROVED;

  // 3. Create new user (password hashing handled in model)
  const newUser = await User.create({
    name,
    email,
    password,
    role,
    status,
  });

  // 4. Send response (never send password)
  res.status(201).json({
    success: true,
    message: "Your account has been created successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt,
    },
  });
});

/**
 * SIGNIN – Login existing user
 * - Validates email & password
 * - Checks user status
 * - Allows login only if APPROVED
 */
exports.signin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user and explicitly include password
  const user = await User.findOne({ email }).select("+password");

  // 2. Validate email
  if (!user) {
    throw new AppError("Invalid email or password. Please try again.", 401);
  }

  // 3. Block banned users
  if (user.status === USER_STATUS.BANNED) {
    throw new AppError("Your account is banned.", 403);
  }

  // 4. Block users pending approval
  if (user.status === USER_STATUS.PENDING) {
    throw new AppError("Your account is pending approval.", 403);
  }

  // 5. Validate password
  const isPasswordCorrect = await user.correctPassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password. Please try again.", 401);
  }

  /**
   * 6. Generate JWT with give TTL
   */
  const token = signAccessToken({ id: user._id });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: token,
    },
  });
});
