const mongoose = require("mongoose");

const firstLinkSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  link: { type: String, default: "" },
});
const secondLinkSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  link: { type: String, default: "" },
});

const footerSchema = new mongoose.Schema(
  {
    youtubeLink: { type: String, default: "" },
    facebookLink: { type: String, default: "" },
    instagramLink: { type: String, default: "" },
    newsLetterCTA: { type: String, default: "JOIN OUR NEWS LETTER" },
    newsLetterCTASubtitle: {
      type: String,
      default: "You need to our newsletter",
    },
    bottomFooterCopyright: {
      type: String,
      default: "© 2025. SKBBL, All Rights Reserved.",
    },
    firstLinkTitle: { type: String, default: "" },
    firstLink: [firstLinkSchema],
    secondLinkTitle: { type: String, default: "" },
    secondLink: [secondLinkSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Footer", footerSchema);
