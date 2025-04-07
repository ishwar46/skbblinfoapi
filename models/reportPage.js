const mongoose = require("mongoose");

const reportItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  reportType: {
    type: String,
    required: true,
  },
  uploadedAt: { type: Date, default: Date.now },
});

const reportPageSchema = new mongoose.Schema(
  {
    reports: [reportItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReportPage", reportPageSchema);
