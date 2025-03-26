const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectLogo: { type: String, default: "" },
  projectImages: [{ type: String, default: "" }],
  title: { type: String, default: "", required: true },
  descriptionParagraph: [{ type: String, default: "", required: true }],
});

const projectPageSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, default: "Projects" },
    projects: [projectSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectPage", projectPageSchema);
