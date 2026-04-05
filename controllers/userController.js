// controllers/userController.js
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");

// Get All Users
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    data: users,
  });
});

// Update Role
exports.updateRole = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid user ID", 400, "UPDATE_ROLE"));
  }

  const allowedRoles = ["viewer","analyst","admin"];
  if (!allowedRoles.includes(role)) {
    return next(new AppError("Invalid role value", 400, "UPDATE_ROLE"));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("User not found", 404, "UPDATE_ROLE"));
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated",
    data: user,
  });
});

exports.toggleStatus = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid user ID", 400, "UPDATE_ROLE"));
  }
  
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  user.status = user.status === "active" ? "inactive" : "active";

  await user.save();

  res.json({
    msg: `User is now ${user.status}`,
    user
  });
};