// models/Record.js
const mongoose = require("mongoose");

// models/Record.js
const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  type: { type: String, enum: ["income", "expense"] },
  category: String,
  date: Date,
  note: String,

  isDeleted: { type: Boolean, default: false }, // 👈 important
  deletedAt: { type: Date, default: null }      // 👈 optional
}, { timestamps: true });

module.exports = mongoose.model("Record", recordSchema);