const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  reportFile: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const reportPageSchema = new mongoose.Schema(
  {
    reports: { type: Map, of: reportSchema }, // Allows dynamic keys (e.g., "report1", "report2")
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReportPage", reportPageSchema);
