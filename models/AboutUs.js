const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, default: "About Us" },
    pageSubtitle: { type: String, default: "" },
    ourStory: { type: String, default: "" },
    ourVision: { type: String, default: "" },
    ourMission: { type: String, default: "" },
    storyImage: { type: String, default: "" },
    visionImage: { type: String, default: "" },
    missionImage: { type: String, default: "" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("AboutUsPage", aboutUsSchema);
