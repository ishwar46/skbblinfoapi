const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: "", },
  storyImage: [{ type: String, default: "", }],
  vids: [
    {
      title: { type: String, required: true },
      videoId: { type: String, required: true },
    },
  ],
  fullStory: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
});

const storyPageSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, required: true, default: "Our Stories" },
    pageDescription: { type: String, default: "" },
    stories: [storySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoryPage", storyPageSchema);
