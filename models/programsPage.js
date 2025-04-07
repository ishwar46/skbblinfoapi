const mongoose = require("mongoose");

const programItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  programImage: { type: String, default: "" },
  bullets: [{ type: String }],
  fullDescription: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const programsPageSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, default: "Our Programs & Initiatives" },
    pageSubtitle: { type: String, default: "" },
    programs: [programItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgramsPage", programsPageSchema);
