// controllers/dashboardController.js
const Record = require("../models/Record");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Summary
exports.getSummary = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  //console.log("REQ USER ID:", req.user._id);
  if (!userId) {
    return next(new AppError("Unauthorized", 401, "GET_SUMMARY"));
  }
  
  const records = await Record.find({isDeleted: false});

  let income = 0, expense = 0;

  records.forEach((r) => {
    if (r.type === "income") income += r.amount;
    else expense += r.amount;
  });

  const categoryWise = await Record.aggregate([
    { $match: {isDeleted: false } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        total: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    totalIncome: income,
    totalExpense: expense,
    netBalance: income - expense,
    categoryWise,
  });
});

// Trends
exports.getTrends = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError("Unauthorized", 401, "GET_TRENDS"));
  }

  const { type } = req.query;
  console.log("Type: ",type);

  if (type && !["monthly", "yearly"].includes(type)) {
    return next(new AppError("Invalid trend type", 400, "GET_TRENDS"));
  }

  let groupFormat;

  if (type === "yearly") {
    groupFormat = {
      year: { $year: "$date" },
    };
  } else {
    groupFormat = {
      year: { $year: "$date" },
      month: { $month: "$date" },
    };
  }

  const trends = await Record.aggregate([
    {
      $match: {isDeleted: false},
    },
    {
      $group: {
        _id: groupFormat,
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: trends,
  });
});

// Recent Transactions
exports.getRecent = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError("Unauthorized", 401, "GET_RECENT"));
  }

  const records = await Record.find({isDeleted: false})
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: records,
  });
});