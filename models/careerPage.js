const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
  deadline: { type: Date },
});

const careerPageSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, required: true, default: "Careers" },
    documents: [careerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerDocumentPage", careerPageSchema);
