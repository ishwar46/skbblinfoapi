const mongoose = require("mongoose");

const branchesSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  manager: { type: String, required: true },
  location: { type: String, required: true },
  contact: [{ type: String, required: true }],
  email: { type: String, required: true },
});

const branchPageSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, default: "Branches" },
    branches: [branchesSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branches", branchPageSchema);
