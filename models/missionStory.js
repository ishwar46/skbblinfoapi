const mongoose = require("mongoose");

const missionStorySchema = new mongoose.Schema(
    {
        pageTitle: { type: String, required: true, default: "Our Mission & Story" },
        pageSubtitle: { type: String, default: "We believe that every child deserves an education, every patient deserves medical care, and every community deserves hope." },
        description: { type: String, required: true },
        fullContent: { type: String, required: true },
        youtubeVideos: [
            {
                title: { type: String, required: false },
                videoId: { type: String, required: false },
            },
        ],
        images: [
            {
                title: { type: String, required: false },
                imageUrl: { type: String, required: false },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("MissionStory", missionStorySchema);
