const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  category: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
});

const reportPageSchema = new mongoose.Schema(
  {
    categories: [{ type: String, required: true, unique: true }],
    documents: [reportSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReportPage", reportPageSchema);
