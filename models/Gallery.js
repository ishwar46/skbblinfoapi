const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  imageName: { type: String, default: "" },
  order: { type: Number, default: 0 },
  fileSize: { type: Number, default: 0 }, // in bytes
  width: { type: Number, default: 0 }, // in px
  height: { type: Number, default: 0 }, // in px
});

const gallerySchema = new mongoose.Schema(
  {
    pageTitle: { type: String, default: "Gallery" },
    pageSubtitle: { type: String, default: "Explore Our Work in Action" },
    images: [galleryImageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
