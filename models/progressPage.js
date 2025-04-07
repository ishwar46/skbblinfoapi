const mongoose = require("mongoose");

const progressItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  dataType: {
    type: String,
    enum: ["value", "percentage"],
    default: "value",
  },
  progressImage: { type: String, default: "" },
});

const progressPageSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, default: "Progress at a glance" },
    centralImage: { type: String },
    progressItems: [progressItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgressPage", progressPageSchema);
