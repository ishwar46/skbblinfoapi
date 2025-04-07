const mongoose = require("mongoose");

const testimonialItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: "" },
  testimonialImage: { type: String, default: "" },
  rating: { type: Number, default: 5 },
  quote: { type: String, default: "" },
});

const testimonialsPageSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, default: "Testimonials – Voices of Impact" },
    pageSubtitle: { type: String, default: "What People Say About Us" },
    pageDescription: {
      type: String,
      default: "",
    },
    testimonials: [testimonialItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestimonialsPage", testimonialsPageSchema);
