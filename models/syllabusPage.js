const mongoose = require("mongoose");

const syllabusSchema = new mongoose.Schema({
  category: { type: String, required: true },
  designation: { type: String, required: true },
  fileUrl: { type: String, required: true },
  jobType: { type: String, enum: ["Internal", "Open"], required: true },
});

const syllabusPageSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, required: true, default: "Syllabus" },
    documents: [syllabusSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SyllabusPage", syllabusPageSchema);
