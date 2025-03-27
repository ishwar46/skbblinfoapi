const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, default: "About SKBBL" },
    pageDescription: { type: String, default: "" },
    centralImage: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    ourVision: { type: String, default: "" },
    ourMission: { type: String, default: "" },
    ourValues: { type: String, default: "" },
    ourObjectives: { type: String, default: "" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("AboutPage", aboutSchema);
