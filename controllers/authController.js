const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { registerSchema, loginSchema } = require("../utils/validation");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// 🔐 Register
exports.register = asyncHandler(async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 400, "REGISTER_API"));
  }

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError("Email already registered", 409, "REGISTER_API"));
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
  });
});

// 🔑 Login
exports.login = asyncHandler(async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 400, "LOGIN_API"));
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && user.status === "inactive") {
    return res.status(403).json({
      msg: "Account is inactive. Contact admin."
    });
  }
  
  if (!user) {
    return next(new AppError("Invalid credentials", 401, "LOGIN_API"));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401, "LOGIN_API"));
  }

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
  });
});