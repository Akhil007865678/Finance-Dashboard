// controllers/recordController.js

const Record = require("../models/Record");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Create Record
exports.createRecord = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError("Unauthorized", 401, "CREATE_RECORD"));
  }

  const record = await Record.create({
    ...req.body,
    userId,
  });

  res.status(201).json({
    success: true,
    data: record,
  });
});

// Get Records (Filter + Search + Pagination)
exports.getRecords = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError("Unauthorized", 401, "GET_RECORDS"));
  }

  let { type, category, search, page = 1, limit = 5 } = req.query;

  // ✅ Validate pagination
  page = Number(page);
  limit = Number(limit);

  if (page < 1 || limit < 1) {
    return next(new AppError("Invalid pagination values", 400, "GET_RECORDS"));
  }

  let filter = {
    userId,
    isDeleted: false,
  };

  if (type) {
    filter.type = type;
  }

  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  if (search) {
    filter.$or = [
      { category: { $regex: search, $options: "i" } },
      { note: { $regex: search, $options: "i" } },
      { type: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const total = await Record.countDocuments(filter);

  const records = await Record.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    totalRecords: total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    data: records,
  });
});

// Update Record
exports.updateRecord = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) {
    return next(new AppError("Unauthorized", 401, "UPDATE_RECORD"));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid record ID", 400, "UPDATE_RECORD"));
  }

  const record = await Record.findOneAndUpdate(
    { _id: id, userId, isDeleted: false },
    req.body,
    { new: true }
  );

  if (!record) {
    return next(new AppError("Record not found", 404, "UPDATE_RECORD"));
  }

  res.status(200).json({
    success: true,
    message: "Record updated successfully",
    data: record,
  });
});

// Soft Delete Record
exports.deleteRecord = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) {
    return next(new AppError("Unauthorized", 401, "DELETE_RECORD"));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid record ID", 400, "DELETE_RECORD"));
  }

  const record = await Record.findOneAndUpdate(
    { _id: id, userId, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    { new: true }
  );

  if (!record) {
    return next(new AppError("Record not found", 404, "DELETE_RECORD"));
  }

  res.status(200).json({
    success: true,
    message: "Record soft deleted",
    data: record,
  });
});