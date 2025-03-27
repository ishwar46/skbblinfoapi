const mongoose = require("mongoose");

const sliderImagesSchema = new mongoose.Schema({
  sliderImage: { type: String, default: "" },
  order: { type: Number, default: 0 },
});
const imageSlideSchema = new mongoose.Schema({
  image: [sliderImagesSchema],
});

module.exports = mongoose.model("ImageSlide", imageSlideSchema);
